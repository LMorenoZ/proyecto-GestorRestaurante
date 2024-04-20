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
    
    
    <div class="container text-left">
        <div class="row align-items-start">
            <div class="col">
                <h3>Crear nuevo usuario:</h3>
                <div class="imagePreviewWrapper border" :style="{ 'background-image': `url(${previewImage})` }"></div>
                <input class="form-control" type="file" id="seleccionarImagen" @change="handleFileUpload"> 
            </div>
    <div class="col">

        <div class="mb-3">
            <label for="basic-url" class="form-label"></label>
         <div class="input-group">
             <span class="input-group-text" id="basic-addon3">Nombre:</span>
            <input type="text" class="form-control" id="txtNombreUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Escriba su nombre">
            <div class="invalid-feedback">
                Por favor Escriba su nombre.
            </div>
        </div>    
        </div>

        <div class="mb-3">
            <label for="basic-url" class="form-label"></label>
         <div class="input-group">
             <span class="input-group-text" id="basic-addon3">Apellido:</span>
            <input type="text" class="form-control" id="txtApellidoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Escriba su apellido">
            <div class="invalid-feedback">
                Por favor Escriba su Apellido.
            </div>
        </div>    
        </div>

        <div class="mb-3">
            <label for="basic-url" class="form-label"></label>
         <div class="input-group">
             <span class="input-group-text" id="basic-addon3">DUI:</span>
            <input type="text" class="form-control" id="txtDuiUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Escriba su DUI">
            <div class="invalid-feedback">
                Por favor Escriba su DUI.
            </div>
        </div>    
        </div>
        <div class="mb-3">
            <label for="basic-url" class="form-label"></label>
         <div class="input-group">
             <span class="input-group-text" id="basic-addon3">Direccion:</span>
            <input type="text" class="form-control" id="txtDireccionUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Escriba su Direccion">
            <div class="invalid-feedback">
                Por favor Escriba su direccion.
            </div>
        </div>    
        </div>

        <div class="mb-3">
            <label for="basic-url" class="form-label"></label>
         <div class="input-group">
             <span class="input-group-text" id="basic-addon3">Correo Electronico:</span>
            <input type="text" class="form-control" id="txtCorreoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Escriba su Correo">
            <div class="invalid-feedback">
                Por favor Escriba su correo.
            </div>
        </div>    
        </div>

        <div class="input-group mb-3">
            <label class="input-group-text" for="inputGroupSelect01">Puesto:</label>
            <select class="form-select" id="inputGroupSelect01">
                <option selected disabled>Elejir...</option>
                <option value="1">Mesero</option>
                <option value="2">Cocinero</option>
                <option value="3">Cajero</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="basic-url" class="form-label"></label>
         <div class="input-group">
             <span class="input-group-text" id="basic-addon3">Telefono:</span>
            <input type="text" class="form-control" id="txtTelefonoUsuario" required aria-describedby="basic-addon3 basic-addon4" placeholder="Escriba su Telefono">
            <div class="invalid-feedback">
                Por favor Escriba su Telefono.
            </div>
        </div>    
        </div>     
        <div>
            <label for="startDate">Elija su fecha de nacimiento: </label>
            <input id="startDate" class="form-control" type="date" required />
  
        </div>
        <br>
        <div class="container text-center">
            <div class="row align-items-start">
                <!--Columna Vacia-->
            <div class="col">
                
                <div class="col">
                    <button type="submit" id="btnCrearRegistro" class="btn btn-outline-success">Crear Registro </button>
                </div>
            </div>
        <div class="col">
            <button type="button" id="btnRegresar" class="btn btn-outline-danger">Regresar</button>
        </div>
        </div>
        </div>
    </div>
    </div>
  </div>   
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
