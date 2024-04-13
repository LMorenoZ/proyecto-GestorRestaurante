<script setup>
import { ref } from 'vue';

import Login from '../components/Login.vue';
import RecuperarPass from '../components/RecuperarPass.vue';

const loginValor = ref(true)  // 'login': true, 'recover password': false

const cambiarAccion = () => {
    loginValor.value = !loginValor.value 
}
</script>

<template class="row align-items-center ">
    <Login v-show="loginValor"  />
    <RecuperarPass v-show="!loginValor" />
    <!-- Esto lo comente porque en login estaba como un boton, y le puse un label
    <button class="btn btn-success mt-auto" @click="cambiarAccion">
        {{ loginValor ? '¿Has olvidado tu contraseña?' : 'Iniciar sesión'}}
    </button>-->
</template>