<script setup>
    // importando componentes de ui
    import OrdenMesa from '../components/OrdenMesa.vue';

    // importando stores de pinia
    import { useOrdenesStore } from '../stores/ordenes';

    // instanciando stores
    const ordenesStore = useOrdenesStore();
</script>

<template>
    <h1>Órdenes</h1>
    <div class="row">
        <OrdenMesa v-for="orden in ordenesStore.ordenes" :key="orden.id" :orden="orden" />
    </div>
</template>