<script setup>
// importaciones de Vue
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

// importando stores de pinia
import { useProductosStore } from '../../stores/productos';

// importando componentes de ui
import MenuItem from '../../components/Menu/MenuItem.vue';

// Incializando importaciones
const router = useRouter()
const productosStore = useProductosStore()

// variables reactivas
const tiposProductos = ref(productosStore.productosTipos)
const productos = ref(productosStore.productos) 
const mostrarDisponibles = ref(true)
const seccionesVisibles = ref({}); // cada seccion segun el tipo de producto, si el valor es true indica que hay al menos un producto para mostrar

/*** Funciones ***/
// funcion para filtrar productos
const filtrarProductos = tipoProducto => {
  const productosFiltrados = productos.value.filter(producto => producto.tipo === tipoProducto.nombre);
}

// objeto donde cada llave son los tipos de productos y sus valores son un array con todos los productos que corresponden al tipo
const productosCategorizados = computed(() => {
  return Object.fromEntries(
    tiposProductos.value.map(tipoProducto => [tipoProducto.nombre, filtrarProductos(tipoProducto)])
  );
});

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
</script>

<template>
    <h1>Lista de productos</h1>
    <button class="btn btn-success" @click="router.push('/menu/nuevo')">Nuevo producto</button>
    
    <!-- Seleccion para mostrar productos disponibles o no disponibles -->
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
    <div class="row mt-4">
        <div class="col-sm-12 col-md-2 mt-4">
            <h4>Categoría de producto</h4>

            <!-- Seleccion de tabs -->
            <div class="d-flex align-items-start">
                <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">

                    <template v-for="(tipo, index) in tiposProductos" :key="tipo.id">

                        <button :class="`nav-link ${esPrimerElemento(index, 'active')}`" :id="`v-pills-${tipo.id}-tab`"
                            data-bs-toggle="pill" :data-bs-target="`#v-pills-${tipo.id}`" type="button" role="tab"
                            :aria-controls="`v-pills-${tipo.id}`" aria-selected="true">
                            {{ tipo.nombre }}
                        </button>

                    </template>
                </div>
            </div>

        </div>

        <!-- Contenido de las tabs -->
        <div class="col-sm-12 col-md-8">
            <div class="tab-content" id="v-pills-tabContent">
                <template v-for="(tipo, index) in tiposProductos" :key="tipo.id">

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
                    </div>

                </template>
            </div>

        </div>
    </div>


</template>