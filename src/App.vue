<script setup>
  // librerias de vue y afilidados
  import { onMounted } from 'vue';
  import { RouterView } from 'vue-router'

  // los store de pinia
  import { useMesasStore } from './stores/mesas';
  import { useOrdenesStore } from './stores/ordenes';
  import { useUserStore } from './stores/users';
  import { useJornadaStore } from './stores/jornada';

  // componentes de interfaz
  import Navbar from './components/Navbar.vue';
  import Footer from './components/Footer.vue';

  // se instancias todas las stores
  const mesasStore = useMesasStore();
  const ordenesStore = useOrdenesStore();
  const userStore = useUserStore();
  const jornadaStore = useJornadaStore();

  // Trae los datos de la db solo cuando se hayan cargado todos los elementos de la vista
  onMounted(() => {
    mesasStore.traerMesas();
    ordenesStore.traerOrdenes();
    jornadaStore.estadoJornada();
  });
</script>

<template>
  <div class="container d-flex flex-column min-vh-100">
    <Navbar v-if="userStore.userData"></Navbar>
    <router-view></router-view>
    <Footer class="mt-auto mb-0" v-if="userStore.userData"></Footer>
  </div>
</template>

<style>

</style>