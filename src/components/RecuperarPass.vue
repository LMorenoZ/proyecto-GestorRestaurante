<script setup>
import { ref } from 'vue';

const email = ref('')

const enviarRecuperar = correoUsuario => {
    console.log(email.value)
}
</script>

<template>
    <div class="my-2">
        <form @submit.prevent="enviarRecuperar">
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Correo electrónico</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    v-model="email">
                <div id="emailHelp" class="form-text">Escriba su correo electrónico</div>
            </div>
            <div class="d-grid gap-2"> 
                <button type="submit" class="btn btn-primary ml-auto mr-auto">Enviar</button>
            </div>  
        </form>
    </div>
</template>