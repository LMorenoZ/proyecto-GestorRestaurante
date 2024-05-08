import { defineStore } from "pinia";
import { collection, getDocs, getDoc, query, updateDoc, doc, addDoc, deleteDoc, Timestamp, orderBy } from "firebase/firestore/lite";
import { db } from '../firebaseConfig';

import { ordenarArrayPorNombre } from '../utilidades.js'

import { useMensajesStore } from './mensajes';

export const useProductosStore = defineStore('productos', {
    state: () => ({
        productos: [],
        productosTipos: [], // categorias
        cargando: false
    }),
    actions: {
        async traerProductos() {
            this.cargando = true

            const mensajesStore = useMensajesStore();
            
            // if (this.productos.length > 0) return  // no ejecuta el codigo si ya se ha llamado previamente
            
            try {
                const q = query(collection(db, 'menu'), orderBy('nombre', 'asc'));
                const querySnapshot = await getDocs(q);

                // limpiar el array 
                this.productos.length = 0 

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

            // if (this.productosTipos.length > 0) return // no ejecuta la peticion porque los tipos ya estan cargados

            try {
                const q = query(collection(db, 'tipoProducto'),  orderBy('nombre', 'asc'));
                
                const querySnapshot = await getDocs(q);

                // limpiar el array de categorias
                this.productosTipos.length = 0

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
                const objProducto = {...payload, creation: Timestamp.now(),}
                const { id } = await addDoc(collection(db, 'menu'), objProducto);
                mensajesStore.crearMensaje({
                    titulo: 'Producto creado',
                    texto: `El producto ${payload.nombre} se creó exitosamente`,
                    color: 'success',
                    id: 'mensajeProductoCreada',
                    autoEliminar: true,
                });

                // Actualizar UI aniadiendo el nuevo elemento al array en el store
                const productoCreado = {...payload, id}
                this.productos.push(productoCreado)
                this.productos = ordenarArrayPorNombre(this.productos)
            } catch (error) {   
                mensajesStore.crearError('productoNoSeCrea', `No se pudo crear el producto`);
                console.log(error);
            }
        },
        async actualizarProducto(informacionActualizar, idProducto) {

            try {
                const docRef = doc(db, 'menu', idProducto)
                await updateDoc(docRef, informacionActualizar)

                // actualizar store
                const indiceActualizar = this.productos.findIndex(prod => prod.id === idProducto)
                const productoNoActualizado = this.productos[indiceActualizar]
                const productoActualizado = {...productoNoActualizado, ...informacionActualizar}
                this.productos[indiceActualizar] = productoActualizado
            } catch {
                console.log(error)
            }
        },
        async eliminarProducto(idProducto) {
            try {
                await deleteDoc(doc(db, 'menu', idProducto));

                // actualizar el UI eliminando el elemento de este store
                this.productos = this.productos.filter(prod => prod.id !== idProducto)
            } catch (error) {
                throw error
            }
        },
        async crearCategoria(categoriaObj) {
            try {
                const { id } = await addDoc(collection(db, 'tipoProducto'), categoriaObj);
                
                // actualizar informacion en el UI:
                this.productosTipos.push({...categoriaObj, id})
                this.productosTipos = ordenarArrayPorNombre(this.productosTipos)
            } catch (error) {
                console.log(error);
                throw error
            }
        },
        async eliminarCategoria(categoriaId) {
            try {
                await deleteDoc(doc(db, "tipoProducto", categoriaId));

                // actualizando el store para actualizar las UI
                this.productosTipos = this.productosTipos.filter(prod => prod.id !== categoriaId)
            } catch (error) {
                throw error
            }
        }
    },
    getters: {
         listarProductos(state) {
            const productos = state.productos
            return productos;
        },
        listarTipoProductos(state) {
            return state.productosTipos
        },
        filtrarProductos(state) { // filtra productos segun la categoria
            return nombreCategoria => {
                return state.productos.filter(prod => prod.tipo === nombreCategoria)
            }
        },
    }
});