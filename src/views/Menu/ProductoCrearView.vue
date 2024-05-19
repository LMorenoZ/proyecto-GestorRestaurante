<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

import { ref as firebaseRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import { useProductosStore } from '../../stores/productos'
import { useMensajesStore } from '../../stores/mensajes';

import { storage } from '../../firebaseConfig';
import { USDollar, uploadFile } from '../../utilidades';

const router = useRouter()

// inicializar store de pinia
const useProductos = useProductosStore()
const mensajesStore = useMensajesStore()

// traer los productos desde la db
const productosTipos = useProductos.productosTipos

// valores reactivos para la informacion del producto
const nombreProd = ref(null)
const descProd = ref(null)
const precioProd = ref(null)
const tipoProd = ref(null)
const disponibilidadProd = ref(true)  // 0: desechado  -  1: no disponible  -    2: disponible

const creandoProducto = ref(false)
const formularioNoValido = ref(false)

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

// funcion que comprueba que todos los inputs no esten vacios para que habilitar al boton de creacion del producto
const puedeCrear = computed(() => {
    const puede = nombreProd.value && descProd.value && (precioProd.value >= 0.01) && tipoProd.value && selectedFile.value

    return puede
})

// crear producto
const crearProducto = async () => {

    // validacion
    if (!puedeCrear.value) {
        mensajesStore.crearMensaje({
            titulo: 'Producto nulo',
            texto: 'Escriba toda la información para crear el producto',
            color: 'secondary',
            id: 'productoCrearNulo',
            autoEliminar: true
        })
        formularioNoValido.value = true
        return
    }
    formularioNoValido.value = false
    creandoProducto.value = true

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

        // limpiar los inputs
        nombreProd.value = null
        descProd.value = null
        precioProd.value = null
        tipoProd.value = null
        selectedFile.value = null
        previewImage.value = null

    } catch (error) {
        mensajesStore.crearError('falloCrearProducto', 'No se pudo crear el producto')
        console.log(error)
    } finally {
        creandoProducto.value = false
    }
}

</script>

<template>
    <div class="container text-left">
        <h1 class="text-center mb-4">Crear nuevo producto</h1>
        <!-- <form @submit.prevent="crearProducto" class="was-validated"> -->
        <form @submit.prevent="crearProducto" :class="{ 'was-validated': formularioNoValido }">
            <div class="row">
                <div class="col-md-6 col-12">
                    <h4>Nombre del producto:</h4>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control i" id="nombreProducto" placeholder="" required
                            v-model.trim="nombreProd">
                        <label for="nombreProducto">Ingrese el nombre</label>
                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>

                    </div>

                    <h4>Descripcion del producto:</h4>
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="descripcionProducto" placeholder="" required
                            v-model.trim="descProd">
                        <label for="descripcionProducto">Ingrese la descripcion.</label>
                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>
                    </div>
                    <h4>Precio del producto:</h4>
                    <div class="input-group mb-3">
                        <span class="input-group-text">$</span>
                        <input type="number" min="0.01" step="0.01" class="form-control " id="precioProducto"
                            placeholder="Ingrese la cantidad"
                            aria-label="Dollar amount (with dot and two decimal places)" v-model.trim="precioProd" required>

                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>
                    </div>

                    <h4>Disponibilidad del producto:</h4>
                    <div class="input-group mb-3">
                        <select class="form-select" v-model="disponibilidadProd" required>
                            <option value="" disabled>Elija una opción</option>
                            <option :value="2" selected>Disponible</option>
                            <option :value="1">No disponible</option>
                        </select>

                        <div class="invalid-feedback">
                            Por favor digite en el area de texto.
                        </div>
                    </div>

                    <h4>Tipo de producto:</h4>
                    <select class="form-select" id="tipoProducto" required v-model="tipoProd">
                        <option value="" disabled>Elija una opcion</option>
                        <template v-for="tipo in productosTipos" :key="tipo.id">
                            <option :value="tipo.nombre">{{ tipo.nombre }}</option>
                        </template>
                    </select>
                    <div class="invalid-feedback">
                        Por favor elija una opcion.
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
                            <input class="form-control" type="file" id="seleccionarImagen" accept="image/*"
                                @change="handleFileUpload">
                            <div class="d-grid gap-2">
                                <span>Formatos probados: 'jpg', 'jpeg', 'png', 'webp', 'avif'</span>
                                <button class="btn btn-primary mt-2" type="submit" :disabled="!puedeCrear"
                                    v-if="!creandoProducto">Crear
                                    producto</button>
                                <button class="btn btn-primary" type="button" disabled v-else>
                                    <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                    <span role="status"> Creando...</span>
                                </button>
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
                                        <button type="button" class="btn btn-outline-info btn-lg"
                                            @click="router.push('/menu')">Volver a
                                            menú</button>
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
