import { defineStore } from "pinia";
import { collection, getDocs, getDoc, query, updateDoc, doc, addDoc } from "firebase/firestore/lite";
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
        },
        async crearProducto(payload) {
            const mensajesStore = useMensajesStore();

            try {
                await addDoc(collection(db, 'menu'), payload);
                mensajesStore.crearMensaje({
                    titulo: 'Producto creado',
                    texto: `El producto ${payload.nombre} se creó exitosamente`,
                    color: 'success',
                    id: 'mensajeProductoCreada',
                    autoEliminar: true,
                });
                this.traerProductos();
            } catch (error) {
                mensajesStore.crearError('productoNoSeCrea', `No se pudo crear el producto`);
                console.log(error);
            }
        }
    },
    getters: {
         listarProductos(state) {
            const productos = state.productos
            return productos;
        }
    }
});