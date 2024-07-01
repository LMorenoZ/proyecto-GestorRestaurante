<script setup>
// librerias de vue y afiliados
import { computed } from 'vue';

// importando stores de pinia
import { useUserStore } from '../stores/users';
import { useJornadaStore } from '../stores/jornada';

// importando otros modulos
import { fechaFormateada, nombreUsuario } from '../utilidades';

// imagen del navbar
import logoImg from '../assets/logoImg.jpg'

// instanciando las stores
const userStore = useUserStore();
const jornadaStore = useJornadaStore();
//--------------


// metodos
const fechaHoy = computed(() => {
  return fechaFormateada(new Date());
});
</script>

<template>
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg bg-custom navbar-dark">
    <div class="container">

      <!-- Logo -->
      <router-link class="navbar-brand fs-4" active-class="active fw-bolder" to="/">
        <img :src="logoImg" alt="" width="30" height="24">
      </router-link>

      <!-- Username -->
      <span class="nav-link text-light d-none d-lg-inline-block">Bienvenido {{ userStore.userData.nombre }}</span>

      <!-- Sidebar Toggle btn -->
      <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Sidebar -->
      <div class="sidebar offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel">
        <!-- Sidebar header -->
        <div class="offcanvas-header text-white border-bottom">
          <router-link class="offcanvas-header text-white border-bottom text-decoration-none" active-class="active fw-bolder" to="/">
            <img :src="logoImg" alt="" width="30" height="24">
          </router-link>

          <span class="nav-link text-dark">Bienvenido {{ userStore.userData.nombre }}</span>
          <button type="button" class="btn-close btn-close-dark shadow-none" data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
        <!-- Sidebar body -->
        <div class="offcanvas-body d-flex flex-lg-row flex-column p-4 p-lg-0">
          <ul class="navbar-nav justify-content-center align-items-center fs-5 flex-grow-1 pe-3">
            <li class="nav-item mx-2 ">
              <router-link class="nav-link text-dark" active-class="active fw-bolder" to="/mesas">Mesas</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link text-dark" active-class="active fw-bolder" to="/ordenes">Órdenes</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link text-dark" active-class="active fw-bolder" to="/menu">Menú</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link text-dark" to="/administracion" v-if="userStore.userData.email === 'escuelalaurelessv@gmail.com'"
                active-class="active fw-bolder">Administración</router-link>
            </li>
          </ul>
          <!-- Login/ Sign up -->
          <span class="nav-link mt-lg-3 mb-lg-auto" v-if="jornadaStore.jornadaValor">Jornada activa en {{ fechaHoy }}</span>
          <div class="d-flex justify-content-center flex-lg-row flex-column align-items-center gap-3 mt-4">
            
            <button class="btn text-white text-decoration-none rounded-4 ms-auto" style="background-color: #0069d9;"
              @click="userStore.logoutUser()">
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.bg-custom {
  background-color: #0baf0b; /* Cambiar color de fondo a verde */
}

/* Ajustar margen superior e inferior de la fecha en dispositivos grandes */
.nav-link {
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}
</style>
