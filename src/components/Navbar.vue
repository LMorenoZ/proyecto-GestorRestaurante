<script setup>
// librerias de vue y afiliados
import { computed } from 'vue';

// importando stores de pinia
import { useUserStore } from '../stores/users';
import { useJornadaStore } from '../stores/jornada';

// importando otros modulos
import { fechaFormateada, nombreUsuario } from '../utilidades';

// importando componentes de ui
import ModalConfirmacion from './ModalConfirmacion.vue';

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
  <nav class="navbar navbar-expand-lg bg-info" data-bs-theme="dark">
    <div class="container">

      <!-- Logo -->
      <router-link class="navbar-brand fs-4" active-class="active fw-bolder" to="/">
        <img :src="logoImg" alt="" width="30" height="24">
      </router-link>

      <span class="nav-link text-light">Bienvenido {{ nombreUsuario(userStore.userData.email) }}</span>
      <!-- Toggle btn -->
      <button class="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Sidebar -->
      <div class="sidebar offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel">
        <!-- Sidebar header -->
        <div class="offcanvas-header text-white border-bottom">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Pupusería</h5>
          <span class="nav-link">Bienvenido {{ nombreUsuario(userStore.userData.email) }}</span>
          <button type="button" class="btn-close btn-close-white shadow-none" data-bs-dismiss="offcanvas"
            aria-label="Close"></button>
        </div>
        <!-- Sidebar body -->
        <div class="offcanvas-body d-flex flex-lg-row flex-column p-4 p-lg-0">
          <ul class="navbar-nav justify-content-center align-items-center fs-5 flex-grow-1 pe-3">
            <li class="nav-item mx-2">
              <router-link class="nav-link" active-class="active fw-bolder" to="/mesas">Mesas</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link" active-class="active fw-bolder" to="/ordenes">Órdenes</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link" active-class="active fw-bolder" to="/menu">Menú</router-link>
            </li>
            <li class="nav-item mx-2">
              <router-link class="nav-link" to="/administracion" v-if="userStore.userData.email === 'admin@test.com'"
                active-class="active fw-bolder">Administración</router-link>
            </li>
          </ul>
          <!-- Login/ Sign up -->
          <span class="nav-link" v-if="jornadaStore.jornadaValor">Jornada activa en {{ fechaHoy }}</span>
          <div class="d-flex justify-content-center flex-lg-row flex-column align-items-center gap-3">
            <button class="btn text-white text-decoration-none px-3 py-1 rounded-4" style="background-color: #f94ca4;"
              data-bs-toggle="modal" data-bs-target="#modalCerrarSesion">
              Salir
            </button>
            <ModalConfirmacion id="modalCerrarSesion" titulo="Cerrar sesión"
              cuerpo="¿Está seguro que desea cerrar sesión?" color="primary" @accion="userStore.logoutUser()"
              texto-boton="Cerrar sesión" />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
@media (max-width: 991px) {
  .sidebar {
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
  }
}
</style>