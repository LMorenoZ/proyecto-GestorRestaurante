<script setup>
  // librerias de vue y afiliados
  import { computed } from 'vue'; 

  // importando stores de pinia
  import { useUserStore } from '../stores/users';
  import { useJornadaStore } from '../stores/jornada';

  // importando otros modulos
  import { fechaFormateada, nombreUsuario } from '../utilidades';

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
    <nav class="navbar  bg-primary navbar-expand-lg  ">
      <div class="container-fluid  ">
        <div class="flex-grow-1">
          <a class="navbar-brand text-light">Sistema pupuseria</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse " id="navbarTogglerDemo02">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item ">
              <span class="nav-link text-light">Bienvenido {{nombreUsuario(userStore.userData.email)}}</span>
            </li>
            <li class="nav-item ">
              <span class="nav-link text-light" v-if="jornadaStore.jornadaValor">Jornada activa en {{fechaHoy}}</span>
            </li>
            <li class="nav-item ">
              <router-link class="nav-link text-light fw-light" to="/mesas">Mesas</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/ordenes">Ordenes</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link text-light" to="/administracion" v-if="userStore.userData.email === 'admin@test.com'">Administración</router-link>
            </li>
            <li class="nav-item">
                <button class="nav-link text-light" @click="userStore.logoutUser()">Salir</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>