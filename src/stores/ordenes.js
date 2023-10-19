import { defineStore } from 'pinia';
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig';

export const useOrdenesStore = defineStore('ordenesStore', {
    state: () => ({
        ordenes: []
    }),
    getters: { // Propiedades computadas, no cambian el valor del estado, siempre retornan algo
        cantidadOrdenes(state) {
            return state.ordenes.length;
        }
    },
    actions: {  // metodos que mutan el valor del estado
        async traerOrdenes() {
            try {
                const q = query(collection(db, 'orden'), orderBy("fecha", "desc"));
                const querySnapshot = await getDocs(q);

                this.ordenes = [];  // se borran todas las ordenes
                querySnapshot.forEach(orden => {
                    this.ordenes.push({...orden.data(), id: orden.id})
                });
            } catch (error) {
                console.log(error)
            }
        },
        async agregarOrden(orden) {
            const ordenNueva = orden;
            ordenNueva.fecha = Timestamp.now();
            console.log(orden);
            try {
                await addDoc(collection(db, 'orden'), ordenNueva);

                this.traerOrdenes();
            } catch(error) {
                console.log(error);
            }
        },
        async actualizarOrden(ordenModificada) {

            try {
                const docRef = doc(db, 'orden', ordenModificada.id);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }

                await updateDoc(docRef, {
                    estado: ordenModificada.estado
                });
                this.traerOrdenes();
            } catch(error) {
                console.log(error);
            }
        }
    }
});