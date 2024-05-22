<script setup>
import { onBeforeMount, ref } from 'vue';

import Login from '../components/Login.vue';
import RecuperarPass from '../components/RecuperarPass.vue';

import { useUserStore } from '../stores/users';

const userStore = useUserStore()

const formularioLogin = ref(true)  // 'login': true, 'recover password': false

const cambiarAccion = () => {
    formularioLogin.value = !formularioLogin.value 
}

onBeforeMount(() => {
    userStore.getEmpleadosDeshabilitados()
})
</script>

<template class="row align-items-center ">
    <Login @cambiarFormulario="cambiarAccion" v-if="formularioLogin"  />
    <RecuperarPass @cambiarFormulario="cambiarAccion" v-else />
</template>