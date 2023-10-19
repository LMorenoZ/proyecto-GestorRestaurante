<script setup>
  import { useUserStore } from '../stores/users';
  const userStore = useUserStore();
</script>

<template>
    <nav class="navbar  bg-primary navbar-expand-lg  ">
      <div class="container-fluid  ">
        <div class="flex-grow-1">
          <a class="navbar-brand text-light">Sistema de admnistracion de pupuseria</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse " id="navbarTogglerDemo02">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item ">
              <router-link class="nav-link text-light" to="/mesas">Mesas</router-link>
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