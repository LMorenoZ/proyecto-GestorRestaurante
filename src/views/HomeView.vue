<script setup>
import { ref } from 'vue';

import Login from '../components/Login.vue';
import RecuperarPass from '../components/RecuperarPass.vue';

const formularioLogin = ref(true)  // 'login': true, 'recover password': false

const cambiarAccion = () => {
    formularioLogin.value = !formularioLogin.value 
}
</script>

<template class="row align-items-center ">
    <Login @cambiarFormulario="cambiarAccion" v-if="formularioLogin"  />
    <RecuperarPass @cambiarFormulario="cambiarAccion" v-else />
</template>