<script setup>
import { ref } from 'vue';

// valor del email
const email = ref('')

// funcion que deberia enviar el correo de recuperacion a la direccion especificada
const enviarCorreo = correoUsuario => {
    console.log(email.value)
}

// emits que vienen de la vista Home
const emit = defineEmits(['cambiarFormulario'])

// activa la funcion emit de la vista 'HomeView' para cambiar al formulario de login
const irALogin = () => {
    emit('cambiarFormulario')
}
</script>

<template>
    <!-- Formulario provisional para enviar el correo electronico y poder recuperar la contrasenia -->
    <form @submit.prevent="enviarCorreo">
        <input type="email" v-model="email">
        <div>Escriba su correo electrónico</div>
        <button type="submit">Enviar</button>
    </form>

    <span style="color: #6c757d; cursor: pointer;" @click="irALogin">Inicia sesión si ya tiene cuenta </span>
</template>