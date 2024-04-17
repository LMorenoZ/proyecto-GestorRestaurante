<script setup>
// importaciones de vue
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// importando el store de productos
import { useProductosStore } from '../../stores/productos';

// importando funciones de utilidades
import { encontrarProducto, printf } from '../../utilidades';

// inicializando el store de los productos
const productosStore = useProductosStore()

// objetos para utilizar la ruta actual y el router para redirigir a paginas, respectivamente
const route = useRoute()
const router = useRouter()

// id del producto del que se mostrara informacion
const idProducto = route.params.id;

// variables reactivas que muestran la informacion del producto
const nombre = ref(null)
const descripcion = ref(null)
const precio = ref(null)
const tipo = ref(null)
const foto = ref(null)
const previewImage = ref(null)

// recuperando objeto con la informacion del producto
const producto = computed(() => {
    const productoInfo = encontrarProducto(productosStore.productos, idProducto)

    nombre.value = productoInfo?.nombre
    descripcion.value = productoInfo?.desc
    precio.value = productoInfo?.precio
    tipo.value = productoInfo?.tipo
    foto.value = productoInfo?.foto

    return productoInfo;
})

// funcion para poder mostrar la imagen en el div
const handleFileUpload = e => {
    const file = e.target.files[0]
    foto.value = file

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.value = e.target.result;
            foto.value = previewImage.value
        };
        reader.readAsDataURL(file);
    }
}


// funcion para actualizar los datos del producto
const actualizar = async () => {
    console.log(nombre.value, descripcion.value, precio.value, tipo.value)
}

</script>

<template>

    <!-- Muestra el div hasta que se hallan traido los datos de la base de datos -->
    <div v-if="producto">
        <!-- Componente provisional para mostrar en un formulario la información del producto a editar -->
        <h1>Editar informacion</h1>

        <p>Nombre:</p>
        <input type="text" v-model="nombre">
        <p>Descripcion:</p>
        <input type="text" v-model="descripcion">
        <p>Precio ($):</p>
        <input type="number" v-model="precio">
        <p>Tipo de producto:</p>
        <select v-model="tipo">
            <option disabled value="">Elija opcion</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
        </select>
        <p>Foto:</p>

        <!-- Muestra la imagen seleccionada -->
        <div class="prevImagen">
            <div class="border border-default">
                <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${foto})` }">
                </div>
            </div>
            <div class="invalid-feedback">
                Por favor elija una imagen.
            </div>
        </div>

        <!-- Seleccionar imagen para -->
        <div class="prevImagen">
            <label for="seleccionarImagen" required class="form-label">Seleccione una imagen para el
                producto:</label>
            <input class="form-control" type="file" id="seleccionarImagen" @change="handleFileUpload">
            <div class="invalid-feedback">
                Por favor elija una imagen.
            </div>
        </div>
        <button class="btn btn-primary mt-2"  @click="actualizar">Actualizar producto</button>
    </div>

    <!-- Div que se muestra solo mientras se cargan los datos desde la base de datos -->
    <div v-else>
        Cargando información...
    </div>

    <!-- Boton que regresa al menu -->
    <button type="button" class="btn btn-info" @click="router.push('/menu')">Ir al menú</button>
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
