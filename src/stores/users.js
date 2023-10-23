import { defineStore } from "pinia";
import { auth, authCreacion, creacionUsuariosApp, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore/lite';
import router from "../router";

export const useUserStore = defineStore('users', {
    state: () => ({
        userData: null,
        listaEmpleados: []     // lista de empleados que no son el admin
    }), 
    getters: {
        esAdmin(state) {
            return state.userData?.email === 'admin@test.com';
        }
    },
    actions: {
        // Acciones respecto a la administracion de usuarios: login, logout, etc..., en 'Authentication'
        async loginUser(email, password) {
            try {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                this.userData = { email: user.email, uid: user.uid };
                console.log(`Hola ${this.userData.email}`); 
            } catch (error) {
                console.log(error);
            }
        },
        async logoutUser() {
            try {
                await signOut(auth);
                this.userData = null;
                router.push('/');
                console.log("Cerro sesion");
            } catch (error) {
                
            }
        }, currentUser() {
            let unsubscribe; // es un observador para la funcion 'onAuthStateChanged'
            return new Promise((resolve, reject) => {
                unsubscribe = onAuthStateChanged(auth, user => {
                    if (user) {
                        this.userData = {email: user.email, uid: user.uid};
                    } else {
                        this.userData = null;
                    }
                    resolve(user);  // Devuelve al usuario
                }); 
            }).then(user => {
                unsubscribe();
                return user;
            });
        }, async createUser(email, password, puesto) {
            try {
                // creando el usuario en Authentication
                const res = await createUserWithEmailAndPassword(authCreacion, email, password);
                await await signOut(authCreacion);  // termina sesion inmediatamente el usuario creado

                // creando el respectivo documento del usuario en la coleccion 'empleados' de firestore
                const nuevoEmpleado = {
                    uid: res.user.uid,
                    email: email,
                    password: password,
                    puesto,
                    creation: Timestamp.now()
                };
                await setDoc(doc(db, 'empleado', res.user.uid), nuevoEmpleado);
                this.listaEmpleados.unshift(nuevoEmpleado);
            } catch (error) {
                console.log(error);
            }
        },

        async getEmpleados() {   // lista de todos los empleados (no se incluye al admin)
            if (this.listaEmpleados.length > 0) { return; }  // si esta llena la lista, no se ejecuta de nuevo
            try {
                const q = query(collection(db, 'empleado'), orderBy("creation", "desc"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(empleado => {
                    this.listaEmpleados.push({...empleado.data(), uid: empleado.id});
                });
            } catch (error) {
                console.log(error);
            }
        },
        async deleteEmpleado(empleadoBorrar) { 
            try {
                // Borrando el empleado como tal
                const { user } = await signInWithEmailAndPassword(authCreacion, empleadoBorrar.email, empleadoBorrar.password);
                const usuarioBorrar = await authCreacion.currentUser;
                await deleteUser(usuarioBorrar);

                // Borrando al empleado de la coleccion en firestore
                await deleteDoc(doc(db, 'empleado',empleadoBorrar.uid));
                console.log('usuario borrado');
                this.listaEmpleados = this.listaEmpleados.filter(empleado => empleado.uid !== empleadoBorrar.uid);
            } catch (error) {
                console.log(error);
            }
        }
    }
});