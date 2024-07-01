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
  onSnapshot,
} from 'firebase/firestore';
import router from '../router';
import { useMensajesStore } from './mensajes';

export const useUserStore = defineStore('users', {
  state: () => ({
    userData: null, // informacion del usuario de Authentication de Firebase
    userRol: null, // del objeto de informacion del usuario en la base de datos, solo para distinguir roles de usuarios
    listaEmpleados: [], // lista de empleados que no son el admin,
    listaEmpleadosDeshabilitados: [],
    trayendoEmpleados: false
  }),
  getters: {
    esAdmin(state) {
      return state.userData?.email === 'escuelalaurelessv@gmail.com';
    },
    userInfo(state) {
      return (userId) => this.listaEmpleados.find(empleado => empleado.uid === userId)
    }
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
        this.userData = { ...this.userData, email: user.email, uid: user.uid };

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
        const { puesto, nombre } = docSnap.data();
        this.userData = { nombre }
        this.userRol = puesto;
        // console.log(this.userData)
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
        if (!this.esAdmin) {
          this.cambiarEstado(idUsuario, false); // false: deslogeado
        }

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
            await this.getRolUsuario(user);
            this.userData = { ...this.userData, email: user.email, uid: user.uid };
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
          uid: res.user.uid,
          creation: Timestamp.now(),
        };

        await setDoc(doc(db, 'empleado', res.user.uid), nuevoEmpleado);
        this.listaEmpleados.unshift(nuevoEmpleado);
      } catch (error) {
        throw error
      }
    },
    // lista de todos los empleados (no se incluye al admin)
    async getEmpleados() {
      const mensajesStore = useMensajesStore();
      if (this.listaEmpleados.length > 0) {
        return;
      } // si esta llena la lista, no se ejecuta de nuevo
      try {
        this.trayendoEmpleados = true

        // no trae al usuario admin, porque no tiene el campo 'creation' en la coleccion de usuarios de la db
        const q = query(collection(db, 'empleado'), orderBy('creation', 'desc'));
        onSnapshot(q, querySnapshot => {
     
          const empleadosSnapshot = []
          
          querySnapshot.forEach(empleado => {
            empleadosSnapshot.push({...empleado.data(), uid: empleado.uid});
          });
          this.listaEmpleados = empleadosSnapshot
        });
      } catch (error) {
        mensajesStore.crearError(
          'noMuestraEmpleados',
          'No se pueden mostrar los empleados'
        );
        console.log(error);
      } finally {
        this.trayendoEmpleados = false
      }
    },
    async getEmpleadosDeshabilitados() {
      try {
        const q = query(collection(db, 'usuariosDeshabilitados'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((empleado) => {
          this.listaEmpleadosDeshabilitados.push({ ...empleado.data(), uid: empleado.id });
        });
      } catch (error) {
        console.log(error);
      }
    },
    async deactivateEmpleado (empleadoBorrar) {
      try {
        // Borrando el empleado de la coleccion de firestore
        await deleteDoc(doc(db, 'empleado', empleadoBorrar.uid));

        // aniadiendo el usuario a la lista de usuarios deshabilitados para que no pueda ingresar sesion
        await addDoc(collection(db, 'usuariosDeshabilitados'), empleadoBorrar)

        // Borrando al empleado de la coleccion en firestore
        this.listaEmpleados = this.listaEmpleados.filter(empleado => empleado.uid !== empleadoBorrar.uid);
      } catch (error) {
          throw error
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
    async actualizarUsuario(informacionActualizar, uid) {
      try {
        const docRef = doc(db, 'empleado', uid) 
        await updateDoc(docRef, informacionActualizar)

        // actualizar store
        const indiceActualizar = this.listaEmpleados.findIndex(usuario => usuario.uid === uid)
        const usuarioNoActualizado = this.listaEmpleados[indiceActualizar]
        const usuarioActualizado = {...usuarioNoActualizado, ...informacionActualizar}
        this.listaEmpleados[indiceActualizar] = usuarioActualizado
      } catch (error) {
        throw error
      }
    },
    // simple combrobacion de que el usuario que quiere iniciar sesion no esta deshabilitado por haber el administrador borrado su cuenta
    async comprobarStatusEmpleado(correoUsuario) { return this.listaEmpleadosDeshabilitados.some(usuario => usuario.email === correoUsuario) }
  },
});
