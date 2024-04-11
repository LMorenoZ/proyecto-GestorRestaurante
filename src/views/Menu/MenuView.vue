<script setup>
// stores de pinia
import { useProductosStore } from '../../stores/productos';

import { useRouter } from 'vue-router';

import MenuItem from '../../components/Menu/MenuItem.vue';

const router = useRouter()

const productosStore = useProductosStore()


const toNuevoProducto = () => {
    router.push('/menu/nuevo')
}
</script>

<template>
    <h1>Lista de productos</h1>
    <button class="btn btn-success" @click="toNuevoProducto">Nuevo producto</button>

    <div class="d-flex flex-wrap">
        <MenuItem v-for="producto in productosStore.menu" :key="producto.id" 
            :id="producto.id" 
            :nombre="producto.nombre" 
            :desc="producto.desc" 
            :foto="producto.foto" 
            :precio="producto.precio" 
            :tipo="producto.tipo"
        />
    </div>
</template>