import { defineStore } from 'pinia';
import { auth, authCreacion, creacionUsuariosApp, db } from '../firebaseConfig';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
import {
  Timestamp,
  query,
  collection,
  doc,
  getDocs,
  addDoc,
  orderBy,
  deleteDoc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore/lite';
import router from '../router';
import { useMensajesStore } from './mensajes';

export const useUserStore = defineStore('users', {
  state: () => ({
    userData: null, // informacion del usuario de Authentication de Firebase
    userRol: null, // del objeto de informacion del usuario en la base de datos, solo para distinguir roles de usuarios
    listaEmpleados: [], // lista de empleados que no son el admin
  }),
  getters: {
    esAdmin(state) {
      // TODO: cambiar el email del admin al real cuando este disponible
      return state.userData?.email === 'admin@test.com';
    },
  },
  actions: {
    // Acciones respecto a la administracion de usuarios: login, logout, etc..., en 'Authentication'
    async loginUser(email, password) {
      const mensajesStore = useMensajesStore();

      try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // obteniendo el rol del usuario, que se usara para las rutas protegidas
        await this.getRolUsuario(user);

        // asignando la informacion del usuario logeado de Authentication
        this.userData = { email: user.email, uid: user.uid };

        // poniendo el estado logeado a activo en el objeto del usuario en la base de datos
        this.cambiarEstado(user.uid, true); // true: usuario logeado

        mensajesStore.crearMensaje({
          titulo: 'Inició sesión',
          texto: `Hola ${this.userData.email}`,
          color: 'success',
          id: 'mensajeIniciarSesion',
          autoEliminar: true,
        });
      } catch (error) {
        this.userRol = null;
        console.log(error);
        throw new Error(error);
      }
    },
    async getRolUsuario(user) {
      // comprobar si el usuario ya esta logeado para salir de la funcion
      if (this.userRol) return;

      // obteniendo el rol del usuario, que se usara para las rutas protegidas
      const docRefUsuario = doc(db, 'empleado', user.uid);
      const docSnap = await getDoc(docRefUsuario);

      if (docSnap.exists()) {
        const { puesto } = docSnap.data();
        this.userRol = puesto;
      } else {
        console.log('Usuario no encontrado');
        throw new Error('Usuario no encontrado');
      }
    },
    async logoutUser() {
      const mensajesStore = useMensajesStore();
      try {
        const idUsuario = this.userData.uid;

        await signOut(auth);
        this.userData = null; // data del usuario
        this.userRol = null; // rol del usuario

        // poniendo el estado logeado a false en el objeto del usuario en la base de datos
        this.cambiarEstado(idUsuario, false); // false: deslogeado

        router.push('/');
      } catch (error) {
        mensajesStore.crearError('errorLogout', 'No se puede cerrar sesión');
        console.log(error);
      }
    },
    currentUser() {
      let unsubscribe; // es un observador para la funcion 'onAuthStateChanged'
      return new Promise((resolve, reject) => {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.userData = { email: user.email, uid: user.uid };
            await this.getRolUsuario(user);
          } else {
            this.userData = null;
            this.userRol = null;
          }
          resolve(user); // Devuelve al usuario
        });
      }).then((user) => {
        unsubscribe();
        return user;
      });
    },
    async createUser(email, password, objUsuario) {
      try {
        // creando el usuario en Authentication
        const res = await createUserWithEmailAndPassword(authCreacion, email, password);
        await await signOut(authCreacion); // termina sesion inmediatamente del usuario creado

        // creando el respectivo documento del usuario en la coleccion 'empleados' de firestore
        const nuevoEmpleado = {
          ...objUsuario,
          logeado: false,
          creation: Timestamp.now(),
        };

        await setDoc(doc(db, 'empleado', res.user.uid), nuevoEmpleado);
        this.listaEmpleados.unshift(nuevoEmpleado);
      } catch (error) {
        console.log(error);
      }
    },

    async getEmpleados() {
      // lista de todos los empleados (no se incluye al admin)
      const mensajesStore = useMensajesStore();
      // if (this.listaEmpleados.length > 0) {
      //   return;
      // } // si esta llena la lista, no se ejecuta de nuevo
      try {
        // no trae al usuario admin, porque no tiene el campo 'creation' en la coleccion de usuarios de la db
        const q = query(
          collection(db, 'empleado'),
          orderBy('creation', 'desc')
        );
        const querySnapshot = await getDocs(q);

        // limpiar el array
        this.listaEmpleados.length = 0

        querySnapshot.forEach((empleado) => {
          this.listaEmpleados.push({ ...empleado.data(), uid: empleado.id });
        });
      } catch (error) {
        mensajesStore.crearError(
          'noMuestraEmpleados',
          'No se pueden mostrar los empleados'
        );
        console.log(error);
      }
    },
    async deleteEmpleado(empleadoBorrar) {
      const mensajesStore = useMensajesStore();
      try {
        // Borrando el empleado como tal
        await signInWithEmailAndPassword(authCreacion, empleadoBorrar.email, empleadoBorrar.password);
        const usuarioBorrar = await authCreacion.currentUser;
        await deleteUser(usuarioBorrar);
        // borran el registro del usuario en la coleccion de firestore
        await deleteDoc(doc(db, 'empleado', empleadoBorrar.uid));

        mensajesStore.crearMensaje({
          titulo: 'Cuenta borrada',
          texto: `La cuenta del empleado ${empleadoBorrar.email} fue eliminada exitosamente`,
          color: 'secondary',
          id: 'empladoEliminado',
          autoEliminar: true,
        });

        // Borrando al empleado de la coleccion en firestore
        this.listaEmpleados = this.listaEmpleados.filter(empleado => empleado.uid !== empleadoBorrar.uid);
      } catch (error) {
        mensajesStore.crearError(
          'noEliminaEmpleado',
          `No se pudo eliminar el empleado ${empleadoBorrar.email}`
        );
        console.log(error);
      }
    },
    async cambiarEstado(id, nuevoEstado) {
      // nuevoEstado - true: logeado, false: no Logeado
      try {
        // se obtiene la referencia al usuario en la base de datos
        const docRef = doc(db, 'empleado', id);

        // se actualiza unicamente el valor 'logeado' al valor especificado
        await updateDoc(docRef, {
          logeado: nuevoEstado,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
});
