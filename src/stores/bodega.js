import { defineStore } from "pinia";
import { collection, getDocs, getDoc, query, updateDoc, doc } from "firebase/firestore/lite";
import { db } from '../firebaseConfig';

import { useMensajesStore } from './mensajes';

export const useBodegaStore = defineStore('bodega', {
    state: () => ({
        ingredientes: []
    }),
    actions: {
        async traerIngredientes() {
            const mensajesStore = useMensajesStore();

            if (this.ingredientes.length > 0) {  // no ejecuta el codigo si ya se ha llamado previamente
                return;
            }

            try {
                const q = query(collection(db, 'ingredientes'));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(ingrediente => this.ingredientes.push({...ingrediente.data(), id: ingrediente.id}));
            } catch (error) {
                mensajesStore.crearError('noTraerIngredientes', 'No se pudo recuperar la información de la bodega');
                console.log(error);
            }
        }, async modificarIngrediente(ingredienteMod) {
            const mensajesStore = useMensajesStore();
            try {
                // se procede a la actualizacion
                const docRef = doc(db, 'ingredientes', ingredienteMod.id);
                await updateDoc(docRef, {
                    cantidad: ingredienteMod.cantidad
                });

                mensajesStore.crearMensaje({
                    titulo: 'Ingrediente modificado', 
                    texto: `La cantidad de ${ingredienteMod.nombre.toLowerCase()} se actualizó correctamente`, 
                    color: 'success', 
                    id: 'mensajeIngredienteModificado',
                    autoEliminar: true
                });
            } catch (error) {
                mensajesStore.crearError('noModIngrediente', `No se pudo modificar la cantidad de ${ingredienteMod.nombre.toLowerCase()} en la bodega`);
                console.log(error);
            }
        }
    }
});