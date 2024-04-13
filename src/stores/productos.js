import { defineStore } from "pinia";
import { collection, getDocs, getDoc, query, updateDoc, doc } from "firebase/firestore/lite";
import { db } from '../firebaseConfig';

import { useMensajesStore } from './mensajes';

export const useProductosStore = defineStore('productos', {
    state: () => ({
        productos: [],
        productosTipos: [],
        cargando: false
    }),
    actions: {
        async traerProductos() {
            this.cargando = true

            const mensajesStore = useMensajesStore();
            
            if (this.productos.length > 0) return  // no ejecuta el codigo si ya se ha llamado previamente
            
            try {
                const q = query(collection(db, 'menu'));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(elem => this.productos.push({...elem.data(), id: elem.id}));
            } catch (error) {
                mensajesStore.crearError('noTraerMenu', 'No se pudo recuperar la información del menú');
                console.log(error);
            } finally {
                this.cargando = false
            }
        },
        async traerProductosTipos() {
            this.cargando = true
            const mensajesStore = useMensajesStore();

            if (this.productosTipos.length > 0) return // no ejecuta la peticion porque los tipos ya estan cargadoos

            try {
                const q = query(collection(db, 'tipoProducto'));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(elem => this.productosTipos.push({...elem.data(), id: elem.id}));
            } catch (error) {
                mensajesStore.crearError('noTraerTipos', 'No se pudo recuperar los tipos de productos');
                console.log(error);
            } finally {
                this.cargando = false
            }
        }
        // async traerIngredientes() {
        //     const mensajesStore = useMensajesStore();

        //     if (this.ingredientes.length > 0) {  // no ejecuta el codigo si ya se ha llamado previamente
        //         return;
        //     }
            
            // try {
            //     const q = query(collection(db, 'ingredientes'));
            //     const querySnapshot = await getDocs(q);
            //     querySnapshot.forEach(ingrediente => this.ingredientes.push({...ingrediente.data(), id: ingrediente.id}));
            // } catch (error) {
            //     mensajesStore.crearError('noTraerIngredientes', 'No se pudo recuperar la información de la bodega');
            //     console.log(error);
            // }
        // }, async modificarIngrediente(ingredienteMod) {
        //     const mensajesStore = useMensajesStore();
        //     try {
        //         // se procede a la actualizacion
        //         const docRef = doc(db, 'ingredientes', ingredienteMod.id);
        //         await updateDoc(docRef, {
        //             cantidad: ingredienteMod.cantidad
        //         });

        //         // modificando el valor en el array del estado
        //         let indexIngrediente = this.ingredientes.findIndex(i => i.id === ingredienteMod.id);
        //         this.ingredientes.splice(indexIngrediente, 1, ingredienteMod);

        //         mensajesStore.crearMensaje({
        //             titulo: 'Ingrediente modificado', 
        //             texto: `La cantidad de ${ingredienteMod.nombre.toLowerCase()} se actualizó correctamente`, 
        //             color: 'success', 
        //             id: 'mensajeIngredienteModificado',
        //             autoEliminar: true
        //         });
        //     } catch (error) {
        //         mensajesStore.crearError('noModIngrediente', `No se pudo modificar la cantidad de ${ingredienteMod.nombre.toLowerCase()} en la bodega`);
        //         console.log(error);
        //     }
        // }
    }
});