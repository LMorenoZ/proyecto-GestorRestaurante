import { defineStore } from 'pinia';
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore/lite';
import { db } from '../firebaseConfig';
import { useOrdenesStore } from './ordenes';

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
        async estadoJornada() {
            try {
                const docRef = doc(db, "jornada", "estadoId");
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data().jornadaActiva ? 'Jornada activa' : 'Jornada cerrada');
                this.jornadaActiva = docSnap.data().jornadaActiva;
            } catch (error) {
                console.log(error);
            }
        },
        async terminarJornada() {
            //validacion para que no se pueda terminar la jornada con ordenes aun pendientes
            const ordenesStore = useOrdenesStore(); 
            const hayPendientes = ordenesStore.ordenes 
                .some(orden => (orden.estado === 'preparacion') || (orden.estado === 'tardada'));
            if (hayPendientes) {
                console.log("No puede terminar la jornada con ordenes aun en curso");
                return;
            }
            
            try {
                // indicando que la jornada ha acabado
                const docRefJornada = doc(db, 'jornada', 'estadoId');
                await updateDoc(docRefJornada, {
                    jornadaActiva: false
                });
                this.jornadaActiva = false;

                /******  generando el resumen de todas las ordenes de la jornada, para el historial de ordenes  ****/
                  

                // validaciones 
                if (ordenesStore.cantidadOrdenes == 0) { 
                    console.log("No se aniadir al historial porque no se realizo ninguna orden");
                    return;
                }

                const ordenesCompletadasTemp = ordenesStore.ordenes.filter(orden => orden.estado === 'completada');
                const ordenesCanceladasTemp = ordenesStore.ordenes.filter(orden => orden.estado === 'cancelada');
                
                // se ganancias y ventas totales a lo largo de la jornada
                let objJornada = {
                    ordenesCompletadas: ordenesCompletadasTemp.length,
                    ordenesCanceladas: ordenesCanceladasTemp.length,
                    gananciasTotales: 0,   // dinero
                    gananciasPerdidas: 0,   // dinero
                    jornadaFecha: Timestamp.now(), // marca de tiempo de firestore, debe ser convertida a Date de JS 
                    quesoTot: 0,  // cantidad de producto vendido
                    revueltasTot: 0,
                    chicharronTot: 0,
                    gaseosaTot: 0,
                    refrescoTot: 0,
                    chocolateTot: 0
                };
                ordenesCompletadasTemp.forEach(ordenCompletada => {
                    objJornada.gananciasTotales += ordenCompletada.pago;
                    objJornada.quesoTot += ordenCompletada.queso;
                    objJornada.revueltasTot += ordenCompletada.revueltas; 
                    objJornada.chicharronTot += ordenCompletada.chicharron;
                    objJornada.gaseosaTot += ordenCompletada.gaseosa;
                    objJornada.refrescoTot += ordenCompletada.refresco;
                    objJornada.chocolateTot += ordenCompletada.chocolate;
                });
                ordenesCanceladasTemp.forEach(ordenCancelada => objJornada.gananciasPerdidas += ordenCancelada.pago);

                console.log(objJornada);
                // crear la entrada en el historial de ordenes
                const docRefHistorial = await addDoc(collection(db, 'historialOrdenes'), objJornada);
                console.log("Jornada completada y aniadida al historial con el id " + docRefHistorial.id);
                
                // se procede a borrar las ordenes en la db
                ordenesStore.ordenes.forEach(async orden => {
                    await deleteDoc(doc(db, "orden", orden.id));
                    console.log(orden.id + ' borrada');
                });

                ordenesStore.$reset(); // se resetea la store de las ordenes
            } catch (error) {
                console.log(error);
            }
        }
    }
});