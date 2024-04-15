<script setup>
// importaciones de vue
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// importando el store de productos
import { useProductosStore } from '../../stores/productos';

// importando funciones de utilidades
import { USDollar, encontrarProducto } from '../../utilidades';

// inicializando el store de los productos
const productosStore = useProductosStore()

// objetos para utilizar la ruta actual y el router para redirigir a paginas, respectivamente
const route = useRoute()
const router = useRouter()

// id del producto del que se mostrara informacion
const idProducto = route.params.id;

// recuperando objeto con la informacion del producto
const productoInfo = computed(() => (encontrarProducto(productosStore.productos, idProducto)))
// const productoInfo = encontrarProducto(productosStore.productos, idProducto)



</script>

<template>
    <!-- Muestra el div hasta que se hallan traido los datos de la base de datos -->
    <div v-if="productoInfo"> 

    <!-- Componente provisional para mostrar la información del producto -->
    <h1>Editar informacion de {{ route.params.id }}</h1>

        <p>Id del producto: {{ productoInfo.id }}</p>
        <p>Nombre: {{ productoInfo.nombre }}</p>
        <p>Descripcion: {{ productoInfo.desc }}</p>
        <p>Precio: $ {{ productoInfo.precio }}</p>
        <p>Tipo de producto: {{ productoInfo.tipo }}</p>
        <p>Foto:</p>
        <img :src="`${productoInfo.foto}`">
    </div> 

    <!-- Div que se muestra solo mientras se cargan los datos desde la base de datos -->
    <div v-else>
        Cargando información...
    </div> 

    <!-- Boton que regresa al menu -->
    <button @click="router.push('/menu')">Regresar al menú</button>
</template>
