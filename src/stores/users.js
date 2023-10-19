import { defineStore } from "pinia";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import router from "../router";

export const useUserStore = defineStore('users', {
    state: () => ({
        userData: null
    }), 
    getters: {
        esAdmin(state) {
            return state.userData?.email === 'admin@test.com';
        }
    },
    actions: {
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
        }
    }
});