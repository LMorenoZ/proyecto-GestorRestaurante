<script setup>
import { ref } from 'vue';

const selectedFile = ref(null) // referencia al archivo de la imagen que se selecciona, por defecto es nulo
const previewImage = ref(null) // la imagen como tal para ser mostrada en el div, por defecto nulo

// funcion que muestra la imagen seleccionada en el div
const handleFileUpload = e => {
    const file = e.target.files[0]
    selectedFile.value = file

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}
</script>

<template>
    <!-- Formulario provisional para crear un nuevo usuario trabajador -->
    <h1>Crear nuevo usuario</h1>

    <!-- div donde la imagen seleccionada aparecera como imagen de fondo -->
    <div class="imagePreviewWrapper border" :style="{ 'background-image': `url(${previewImage})` }"></div>

    <!-- Input para seleccionar la imagen -->
    <input class="form-control" type="file" id="seleccionarImagen" @change="handleFileUpload"> 
</template>

<!-- CSS de este componente -->
<style scoped>
/* CSS de la clase del div de la imagen */
.imagePreviewWrapper {
    width: 250px;
    height: 250px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center center;
}
</style>
