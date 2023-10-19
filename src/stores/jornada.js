import { defineStore } from 'pinia';
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig';

export const useJornadaStore = defineStore('jornada', {
    state: () => ({
        jornadaActiva: false
    }), 
    getters: {
        jornadaValor(state) {
            return state.jornadaActiva;
        }
    },
    actions: {
        async empezarJornada() {
            try {
                const docRef = doc(db, 'jornada', 'estadoId');
                await updateDoc(docRef, {
                    jornadaActiva: true
                });
                this.jornadaActiva = true; 
                console.log("Se inicio la jornada");
            } catch (error) {
                console.log(error);
            }
        }, 
        async terminarJornada() {
            try {
                const docRef = doc(db, 'jornada', 'estadoId');
                await updateDoc(docRef, {
                    jornadaActiva: false
                });
                this.jornadaActiva = false;
            } catch (error) {
                console.log(error);
            }
        }, 
        async estadoJornada() {
            try {
                const docRef = doc(db, "jornada", "estadoId");
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data().jornadaActiva ? 'Jornada activa' : 'Jornada cerrada');
                this.jornadaActiva = docSnap.data().jornadaActiva;
            } catch (error) {
                console.log(error);
            }
        }
    }
});