<script setup>
    // store
    import { useBodegaStore } from '../../stores/bodega';

    // componentes de ui
    import IngredienteBodge from '../../components/IngredienteBodega.vue';

    // instanciando stores
    const bodegaStore = useBodegaStore();
</script>

<template>
    <h1>Bodega</h1>
    <div class="div-bodega">
        <IngredienteBodge
            v-for="ingrediente of bodegaStore.ingredientes"
            :key="ingrediente.id"
            :ingrediente="ingrediente"
        />
    </div>
</template>

<style>
    .div-bodega {
        overflow: scroll; 
        height: 70vh
    }
</style>