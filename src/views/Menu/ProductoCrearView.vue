<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useProductosStore } from '../../stores/productos'

import { storage } from '../../firebaseConfig';
import { USDollar, uploadFile } from '../../utilidades';

const router = useRouter()

// inicializar store de pinia
const useProductos = useProductosStore()

// traer los productos desde la db
const productosTipos = useProductos.productosTipos

// valores reactivos para la informacion del producto
const nombreProd = ref(null)
const descProd = ref(null)
const precioProd = ref(null)
const tipoProd = ref(null)
const disponibilidadProd = ref(true)

// valores reactivos para subir la imagen
const selectedFile = ref(null) // archivo de la imagen que subira a storage
const previewImage = ref(null) // uri para mostra la imagen
const isUploading = ref(false)

// para poder mostrar la imagen en el div
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

// crear producto
const crearProducto = async () => {
    // objeto del producto, pero sin el url de la imagen, que no se ha subido
    const producto = {
        nombre: nombreProd.value,
        desc: descProd.value,
        precio: precioProd.value,
        tipo: tipoProd.value,
        disponible: disponibilidadProd.value
    }

    try {
        // subir imagen, devuelve la url de la imgen si se subio correctamente
        const imgURL = await uploadFile(selectedFile.value, 'productos')
        producto.foto = imgURL
        
        useProductos.crearProducto(producto)

    } catch (error) {
        console.log(error)
    }
}

</script>

<template>
    <div class="container text-left">
        <h1 class="text-center mb-4">Crear nuevo producto</h1>
        <form @submit.prevent="crearProducto" class="was-validated">
            <div class="row">
                <div class="col-md-6 col-12">
                    <h4>Nombre del producto:</h4>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control i" id="nombreProducto" placeholder="" required
                            v-model="nombreProd">
                        <label for="nombreProducto">Ingrese el nombre</label>
                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>

                    </div>

                    <h4>Descripcion del producto:</h4>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="descripcionProducto" placeholder="" required
                            v-model="descProd">
                        <label for="descripcionProducto">Ingrese la descripcion.</label>
                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>
                    </div>
                    <h4>Precio del producto:</h4>
                    <div class="input-group mb-3">
                        <span class="input-group-text">$</span>
                        <input type="text" class="form-control " id="precioProducto" placeholder="Ingrese la cantidad"
                            aria-label="Dollar amount (with dot and two decimal places)" required v-model="precioProd">

                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>
                    </div>

                    <h4>Disponibilidad del producto:</h4>
                    <div class="input-group mb-3">
                        <select class="form-select" v-model="disponibilidadProd">
                            <option value="" disabled>Elija una opción</option>
                            <option :value="true" selected>Disponible</option>
                            <option :value="false">No disponible</option>
                        </select>

                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>
                    </div>

                    <div class="col">

                        <div class="form-floating">
                            <h4>Tipo de producto:</h4>
                            <select class="form-select" id="tipoProducto" aria-label="Floating label select" required
                                v-model="tipoProd">
                                <option value="" disabled selected>Elija una opcion</option>
                                <template v-for="tipo in productosTipos" :key="tipo.id">
                                    <option :value="tipo.nombre">{{ tipo.nombre }}</option>
                                </template>
                            </select>
                            <div class="invalid-feedback">
                                Por favor elija una opcion.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-6 col-12">
                    <div class="col">
                        <!-- Imagen preview -->
                        <div class="prevImagen">
                            <div class="border border-default">
                                <div class="imagePreviewWrapper"
                                    :style="{ 'background-image': `url(${previewImage})` }">
                                </div>
                            </div>
                            <div class="invalid-feedback">
                                Por favor elija una imagen.
                            </div>
                        </div>

                        <!-- Subir imagen -->
                        <div class="prevImagen">

                            <label for="seleccionarImagen" required class="form-label">Seleccione una imagen para el
                                producto:</label>
                            <input class="form-control" type="file" id="seleccionarImagen" accept="image/*" @change="handleFileUpload">
                            <div class="d-grid gap-2">
                                <span>Formatos probados: 'jpg', 'jpeg', 'png', 'webp', 'avif'</span>
                                <button class="btn btn-primary mt-2" type="submit">Crear producto</button>
                            </div>
                            <div class="invalid-feedback">
                                Por favor elija una imagen.
                            </div>
                        </div>

                        <br>
                        <br>
                        <div class="container text-center">
                            <div class="row">
                                <div class="col">
                                    <div class="d-grid gap-2">
                                        <button type="button" class="btn btn-outline-info btn-lg" @click="router.push('/menu')">Volver a menú</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
    <div>

    </div>

</template>


<style scoped>
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
