<script setup>
  // librerias de vue y afilidados
  import { onMounted, onBeforeMount } from 'vue';
  import { RouterView } from 'vue-router'

  // los store de pinia
  import { useMesasStore } from './stores/mesas';
  import { useOrdenesStore } from './stores/ordenes';
  import { useUserStore } from './stores/users';
  import { useJornadaStore } from './stores/jornada';
  import { useBodegaStore } from './stores/bodega';
  import { useHistorialStore } from './stores/historial';
  import { useProductosStore } from './stores/productos';

  // componentes de interfaz
  import Navbar from './components/Navbar.vue';
  import Footer from './components/Footer.vue';
  import AlertaContenedor from './components/Alertas/AlertasContenedor.vue';

  // se instancias todas las stores
  const mesasStore = useMesasStore();
  const ordenesStore = useOrdenesStore();
  const userStore = useUserStore();
  const jornadaStore = useJornadaStore();
  const bodegaStore = useBodegaStore();
  const historialStore = useHistorialStore();
  const productosStore = useProductosStore()

  // Trae los datos de la db solo cuando se hayan cargado todos los elementos de la vista
  onBeforeMount(() => {
    mesasStore.traerMesas();
    ordenesStore.traerOrdenes();
    jornadaStore.estadoJornada();
    bodegaStore.traerIngredientes();
    productosStore.traerProductos();
    productosStore.traerProductosTipos();
    
    // Para traer el historial de ordenes
    const fechaHasta = new Date();
    const fechaDesde = new Date(new Date().setDate(fechaHasta.getDate() - 7));
    let rango = [fechaDesde, fechaHasta];
    historialStore.filtrarPorFechas(rango, fechaDesde, fechaHasta);
  });
</script>

<template >
  <Navbar v-if="userStore.userData"></Navbar>
  <AlertaContenedor v-if="userStore.userData" />
  <!-- <div class="container d-flex flex-column p-4" style="min-height: 80vh;"> -->
  <div class="container" style="min-height: 80vh;">
    <router-view></router-view>
  </div>
  <Footer class="mt-auto mb-0" v-if="userStore.userData"></Footer>
</template>