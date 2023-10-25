import { defineStore } from 'pinia';
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig';
import { useMensajesStore } from './mensajes';

export const useOrdenesStore = defineStore('ordenesStore', {
    state: () => ({
        ordenes: []
    }),
    getters: { // Propiedades computadas, no cambian el valor del estado, siempre retornan algo
        cantidadOrdenes(state) {
            return state.ordenes.length;
        },
        ordenesPreparacion(state) {  
            return state.ordenes.filter(orden => orden.estado == 'preparacion').length;
        },
        ordenesTardadas(state) {  
            return state.ordenes.filter(orden => orden.estado == 'tardada').length;
        },
        ordenesCompletadas(state) {
            return state.ordenes.filter(orden => orden.estado == 'completada').length;
        },
        ordenesCanceladas(state) {
            return state.ordenes.filter(orden => orden.estado == 'cancelada').length;
        },
        ordenesActivas(state) {   // en preparacion y tardadas
            return this.ordenesPreparacion + this.ordenesTardadas;
        }
    },
    actions: {  // metodos que mutan el valor del estado
        async traerOrdenes() {
            const mensajesStore = useMensajesStore();   
            try {
                const q = query(collection(db, 'orden'), orderBy("fecha", "desc"));
                const querySnapshot = await getDocs(q);

                this.ordenes = [];  // se borran todas las ordenes
                querySnapshot.forEach(orden => {
                    this.ordenes.push({...orden.data(), id: orden.id})
                });
            } catch (error) {
                mensajesStore.crearError(
                    'noSePudoTraerOrdenes',
                    `No se pueden mostrar las órdenes`
                );
                console.log(error);
            }
        },
        async agregarOrden(orden) {
            const mensajesStore = useMensajesStore();
            const ordenNueva = orden;
            ordenNueva.fecha = Timestamp.now();
            try {
                await addDoc(collection(db, 'orden'), ordenNueva);
                mensajesStore.crearMensaje({
                    titulo: 'Órden añadida', 
                    texto: `Órden de mesa ${orden.mesaNum} aceptada y movida a etapa de preparación`, 
                    color: 'success', 
                    id: 'mensajeOrdenCreada',
                    autoEliminar: true
                });
                this.traerOrdenes();
            } catch(error) {
                mensajesStore.crearError(
                    'ordenNoSeCrea',
                    `No se pudo crear la órden`, 
                );
                console.log(error);
            }
        },
        async actualizarOrden(ordenModificada) {
            const mensajesStore = useMensajesStore();
            try {
                const docRef = doc(db, 'orden', ordenModificada.id);
                const docSnap = await getDoc(docRef);
                
                if (!docSnap.exists()) {
                    throw new Error("No existe el documento");
                }
                
                await updateDoc(docRef, {
                    estado: ordenModificada.estado,
                    pago: ordenModificada.pago
                });

                this.traerOrdenes();

                mensajesStore.crearMensaje({
                    titulo: 'Órden actualizada', 
                    texto: `Órden de la mesa ${ordenModificada.mesaNum} movida a estado ${ordenModificada.estado}`, 
                    color: 'success', 
                    id: `mensajeOrdenModificada${ordenModificada.id}`,
                    autoEliminar: true
                });
            } catch(error) {
                mensajesStore.crearError(
                    'noSePudoActualizarOrden',
                    `La órden no se pudo actualizar`, 
                );
                console.log(error);
            }
        }
    }
});