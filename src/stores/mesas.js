import { ref } from 'vue';
import { defineStore } from 'pinia';
import { query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useMensajesStore } from './mensajes';

export const useMesasStore = defineStore('mesasStore', {
    state: () => ({
        mesas: ref([])
    }),
    getters: { // Propiedades computadas, no cambian el valor del estado, siempre retornan algo
        cantidadMesas(state) {
            return state.mesas.length;
        } 
    },
    actions: {  // metodos que mutan el valor del estado
        async traerMesas() {
            const mensajesStore = useMensajesStore();
            try {
                const q = query(collection(db, 'mesa'), orderBy("mesaNum", "asc"));
                const querySnapshot = await getDocs(q);
            
                this.mesas = []; // elimina el contenido del array para no duplicar datos
                querySnapshot.forEach(mesa => {
                    this.mesas.push({...mesa.data(), id: mesa.id});
                });
            } catch (error) {
                mensajesStore.crearError('noTraeMesas', 'No se pudo traer las mesas');
                console.log(error);
            }
        }, ordenarMesas() {  // metodo para ordenar las mesas descendientemente segun su propiedad numerica 'mesaNum', que es el numero de la mesa
            this.mesas.sort((mesaA, mesaB) => mesaA.mesaNum - mesaB.mesaNum)
        },
        // async traerMesa(id) {
        //     const mensajesStore = useMensajesStore();
        //     try {
        //         const docRef = doc(db, 'mesa', id);
        //         const docSnap = await getDoc(docRef);
        //         return docSnap.data();
        //     } catch (error) {
        //         mensajesStore.crearError('noTraeMesa', 'No se pudo recuperar la información de esta mesa');
        //         console.log(error);
        //     }
        // },
        async añadirMesa(nuevaMesa) {
            const mesaNueva = nuevaMesa;
            mesaNueva.estado = 'libre';

            try {
                const { id } = await addDoc(collection(db, 'mesa'), mesaNueva);

                // actualizando el store
                mesaNueva.id = id
                this.mesas.push(mesaNueva)
                this.ordenarMesas()
            } catch(error) {
                console.log(error);
            }
        },
        async modMesa(mesaModificada) {
            const mensajesStore = useMensajesStore();
            try {
                const docRef = doc(db, 'mesa', mesaModificada.id);
                const docSnap = await getDoc(docRef); // se trae el documento en la bd para una validacion
                if (!docSnap.exists()) { // validacion para comprobar que existe el documento que se pretende eliminar
                    throw new Error("No existe el documento"); 
                }

                // actualizando el documento en cuestion
                await updateDoc(docRef, {
                    estado: mesaModificada.estado
                });

                // actualizando el store
                const indiceMesa = this.mesas.findIndex(mesa => mesa.id === mesaModificada.id)
                this.mesas[indiceMesa].estado = mesaModificada.estado
            } catch (error) {
                mensajesStore.crearError('noModMesa', 'No se pudo modificar la información de esta mesa');
                console.log(error);
            }
        },  
        async borrarMesa(id) {
            const mensajesStore = useMensajesStore();
            try {
                const docRef = doc(db, 'mesa', id); // referencia al documento
                await deleteDoc(docRef);

                // actualizando store
                const indiceMesa = this.mesas.findIndex(mesa => mesa.id === id) 
                this.mesas.splice(indiceMesa, 1)
            } catch (error) {
                mensajesStore.crearError('noBorrarMesa', 'No se pudo borrar la información de esta mesa');
                console.log(error);
            }
        }
    }
});