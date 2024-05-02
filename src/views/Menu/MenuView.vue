<script setup>
// importaciones de Vue
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

// importando stores de pinia
import { useProductosStore } from '../../stores/productos';
import { useMensajesStore } from '../../stores/mensajes';

// importando componentes de ui
import MenuItem from '../../components/Menu/MenuItem.vue';
import ModalConfirmacion from '../../components/ModalConfirmacion.vue'

// Incializando importaciones
const router = useRouter()
const productosStore = useProductosStore()
const mensajesStore = useMensajesStore()

// variables reactivas
const modalRef = ref(null)
const productos = ref(productosStore.productos) 
const mostrarDisponibles = ref(true)
const nombreTipoProductos = computed(() => {
    const listaNombre = []

    for(let tipo of productosStore.listarTipoProductos) {
        listaNombre.push(tipo.nombre)
    }

    return listaNombre;
})

const categoriaNombre = ref()   // para la creacion de la categoria
const hayErrorCategoria = ref(false)
const errorCategoriaMensaje = ref('Debe introducir un nombre')

/*** Funciones ***/

// funcion para establecer clases de Bootstrap al primer elemento resultante de un v-for 
const esPrimerElemento = (index, clases) => {
    let claseBootstrap = '';

    if (index === 0) {
        claseBootstrap = clases
    }

    return claseBootstrap
}

// funcion que determina si hay una lista de productos de cierta categoria y disponibilidad, para mostrar un mensaje de que no hay productos del tipo
const hayProductos = (productos, tipo, disponibilidad) => {
    let productosCumplen = []

    for(let producto of productos) {
        if ( (producto.tipo === tipo.nombre) && (producto.disponible === disponibilidad) ) {
            productosCumplen.push(producto)
        }
    }

    return productosCumplen.length > 0
}

// funcion para crear un nuevo categoria
const crearCategoria = async () => {
    
    const puedeCrearCategoria = categoriaNombre.value && !nombreTipoProductos.value.includes(categoriaNombre.value)
    if (!puedeCrearCategoria) {
        errorCategoriaMensaje.value = categoriaNombre.value ? 'Ya existe la categoría' : 'Rellene el campo'

        hayErrorCategoria.value = true

        mensajesStore.crearMensaje({
            titulo: 'No se creo la categoría',
            texto: errorCategoriaMensaje.value,
            color: 'warning',
            id: 'catIncompleta',
            autoEliminar: true,
        });
        return
    }
    hayErrorCategoria.value = false

    try {
        const categoriaObjeto = { nombre: categoriaNombre.value }
        await productosStore.crearCategoria(categoriaObjeto)

        mensajesStore.crearMensaje({
            titulo: 'Categoría creada',
            texto: `La categoría '${categoriaObjeto.nombre}' se creó exitosamente`,
            color: 'success',
            id: 'mensajeCatCreada',
            autoEliminar: true,
        });
    } catch (error) {
        mensajesStore.crearError('NoCreacionCategoria', 'No se pudo crear la categoría')
        console.log(error)
    } 
}

// funcion para eliminar una categoria vacia
const borrarCategoria = async (categoria) => {
    try {
        await productosStore.eliminarCategoria(categoria.id)

        mensajesStore.crearMensaje({
            titulo: 'Categoría borrada',
            texto: `La categoría '${categoria.nombre}' se borró exitosamente`,
            color: 'success',
            id: 'mensajeCatCreada',
            autoEliminar: true,
        });
    } catch (error) {
        mensajesStore.crearError('NoEliminacionCategoria', 'No se pudo borrar la categoría')
        console.log(error)
    } 
}
</script>

<template>
    <h1>Lista de productos</h1>
    <!-- Boton para que redirige a vista para crear nuevo producto -->
    <button class="btn btn-success" @click="router.push('/menu/nuevo')">Nuevo producto</button>

    <!-- Boton para crear nueva categoria de productos -->
    <button class="btn btn-primary m-2" data-bs-toggle="modal" data-bs-target="#modalCrearCategoria">Crear nueva categoría</button>
    
    <!-- Seleccion para elegir que producto, disponibles o no disponibles, se mostraran -->
    <div class="mt-2 d-flex justify-content-end">
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineDisponibles" :value="true" v-model="mostrarDisponibles" checked>
            <label class="form-check-label" :class="{ 'fw-bold': mostrarDisponibles }" for="inlineDisponibles">Productos disponibles</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineNoDisponibles" :value="false" v-model="mostrarDisponibles">
            <label class="form-check-label" :class="{ 'fw-bold': !mostrarDisponibles}" for="inlineNoDisponibles">Productos no disponibles</label>
        </div>
    </div>

    <!-- Tabs de categorias de productos -->
    <div class="row mt-4 overflow-y-scroll" style="height: 60vh;">
        <div class="col-sm-12 col-md-2 mt-4">
            <h4>Categoría de producto</h4>

            <!-- Seccion de tabs -->
            <div class="d-flex align-items-start">
                <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <template v-for="(tipo, index) in productosStore.listarTipoProductos" :key="tipo.id">
                        <div class="d-grid gap-2">
                            <button :class="`nav-link ${esPrimerElemento(index, 'active')}`" :id="`v-pills-${tipo.id}-tab`"
                            data-bs-toggle="pill" :data-bs-target="`#v-pills-${tipo.id}`" type="button" role="tab"
                            :aria-controls="`v-pills-${tipo.id}`" aria-selected="true">
                                {{ tipo.nombre }}
                            </button>
                        </div>
                        
                    </template>
                </div>
            </div>

        </div>

        <!-- Contenido de las tabs -->
        <div class="col-sm-12 col-md-8">
            <div class="tab-content" id="v-pills-tabContent">
                <template v-for="(tipo, index) in productosStore.listarTipoProductos" :key="tipo.id">
                    <div :class="`tab-pane ${esPrimerElemento(index, 'show active')}`" :id="`v-pills-${tipo.id}`" role="tabpanel"
                        :aria-labelledby="`v-pills-${tipo.id}-tab`" :tabindex="`${index + 1}`">
                        <div class="d-flex flex-wrap">
                            
                            <template v-if="hayProductos(productosStore.productos, tipo, mostrarDisponibles)">

                                <template v-for="producto in productosStore.productos" :key="producto.id">
                                    <template v-if="(producto.tipo === tipo.nombre) && (producto.disponible === mostrarDisponibles)">

                                        
                                        <MenuItem :id="producto.id" :nombre="producto.nombre" :desc="producto.desc"
                                        :foto="producto.foto" :precio="producto.precio" :tipo="producto.tipo" />
                                        
                                    </template>

                                </template>

                            </template>
                            <div v-else>
                                <h4>No hay productos '{{ tipo.nombre }}'' que actualmente sean {{ mostrarDisponibles ? 'disponibles' : 'no disponibles' }}</h4>
                            </div>
                            
                        </div>
                        <div class="d-flex justify-content-center mt-4">
                            <button type="button" class="btn btn-sm btn-warning" data-bs-toggle="modal" :data-bs-target="`#categoriaBorrar${tipo.id}`">
                                Borrar la categoría '{{tipo.nombre}}'
                            </button>
                        </div>
        
                        <!-- Modals para elminiar la categoria. El primero informa al usuario la categoria no debe tener productos, el segundo borra las categorias ya vacias -->
                        <ModalConfirmacion
                            v-if="productosStore.filtrarProductos(tipo.nombre).length > 0"
                            :id="`categoriaBorrar${tipo.id}`"
                            :titulo="`Debe borrar todos los productos`"
                            :cuerpo="`Para borrar esta categoría '${tipo.nombre}' debe estar vacía. Cambie los productos a otras categorías.`"
                            color="info"
                        />

                        <ModalConfirmacion
                            v-else
                            :id="`categoriaBorrar${tipo.id}`"
                            titulo="Borrar categoría"
                            :cuerpo="`¿Desea borrar la categoría '${tipo.nombre}?'`"
                            color="danger"
                            textoBoton="Borrar categoría"
                            :param="tipo"
                            @accion="borrarCategoria"
                        />
                    </div>

                </template>
            </div>

        </div>
    </div>

    


    <!-- Modal para crear una nueva categoria -->
    <div ref="modalRef" class="modal fade" id="modalCrearCategoria" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Crear nueva categoría {{ categoriaNombre }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-1">
                    <label for="categoriaNombre" class="form-label fw-bolder">Nombre:</label>
                    <input type="text" class="form-control" id="categoriaNombre" v-model="categoriaNombre" minlength="1" required>
                    <div class="fw-lighter mt-2 text-danger" v-if="hayErrorCategoria">
                        {{ errorCategoriaMensaje }}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary"  @click="crearCategoria" data-bs-dismiss="modal">Crear</button>
            </div>
            </div>
        </div>
    </div>
</template>