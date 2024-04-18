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
<br>
<h1>Editar informacion</h1>
<br>
<div class="container text-center">
    
  <div class="row">
    <div class="col">
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

    </div>
    <div class="col">
        <label for="basic-url" class="form-label"></label>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon3">Nombre:</span>
                <input type="text" class="form-control" id="txtCambiarNombreProducto" required placeholder="Ingrese el nombre" aria-describedby="basic-addon3">
                <div class="invalid-feedback">
                    Por favor ingrese el nombre.
                </div>

            </div>

            <div class="input-group" required id="txtCambiarDescripcionProducto" >
                <span class="input-group-text">Descripcion:</span>
                <textarea class="form-control" aria-label="With textarea"></textarea>
                <div class="invalid-feedback">
                    Por favor ingrese la descripcion.
                </div>
            </div>

            <label for="basic-url" class="form-label"></label>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon3">Precio:</span>
                <input type="number" class="form-control" id="txtCambiarPrecioProducto" required placeholder="Ingrese el precio" aria-describedby="basic-addon3">
                <div class="invalid-feedback">
                    Por favor ingrese el precio.
                </div>
            </div>

            <select class="form-select" aria-label="Default select example" required id="elegirTipoProducto">
                 <option selected disabled>Tipo de producto:</option>
                 <option value="1">Postre</option>
                 <option value="2">Bebida Caliente</option>
                 <option value="3">Bebida Fria</option>
                 <div class="invalid-feedback">
                    Por favor elija una opcion.
                </div>
            </select>
            <br>
            <div class="container text-center">
            <div class="row">
                <div class="col">
                    <button type="button" class="btn btn-outline-primary">Editar informacion</button>
                </div>
                <div class="col">
                <!-- Muestra el div hasta que se hallan traido los datos de la base de datos -->
                <div v-if="producto">
                    <!-- Componente provisional para mostrar en un formulario la información del producto a editar -->
                    <button class="btn btn-outline-success"  @click="actualizar">Actualizar producto</button>
                </div>

                 <!-- Div que se muestra solo mientras se cargan los datos desde la base de datos -->
                <div v-else>
                    Cargando información...
                </div>
                </div>
                <div class="col">
                        <!-- Boton que regresa al menu -->
                    <button type="button" class="btn btn-outline-info" @click="router.push('/menu')">Ir al menú</button>
                </div>
            </div>
            </div>
            
    </div>
    <div class="col">
      <!--Columna vacia-->
    </div>
  </div>
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
