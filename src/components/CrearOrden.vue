<script setup>
// librerias
import { ref, computed, onMounted } from 'vue';

// stores de pinia
import { useOrdenesStore } from '../stores/ordenes.js';
import { useJornadaStore } from '../stores/jornada.js';
import { useMesasStore } from '../stores/mesas.js';
import { useProductosStore } from '../stores/productos.js';
import { useUserStore } from '../stores/users.js';

// utilidades
import { encontrarProducto, printf } from '../utilidades.js';

// props y emits
const props = defineProps(['modalId', 'mesaNum', 'mesaInfo']);
const emits = defineEmits(['cambiarEstado']);

// instancia de las stores
const ordenesStore = useOrdenesStore();
const jornadaStore = useJornadaStore();
const mesasStore = useMesasStore();
const productosStore = useProductosStore()
const usersStore = useUserStore()
//-----------------------------------------------------------

const productos = productosStore.productos

const cantidades = ref({});
const formOrden = ref(null)  // informacion del formulario con la que se creara la orden

const crearOrden = () => {

    formOrden.value.requestSubmit   // se activa el evento 'submit' del formulario, pero sin recargar la pagina

    const ordenObjeto = {
        mesaNum: props.mesaNum,
        idUsuario: usersStore.userData.uid,
        productos: [],
        estado: "preparacion",
    }

    for (const productoId in cantidades.value) {
        // console.log(`${productoId}: ${cantidades.value[productoId]}`);
        if (cantidades.value[productoId] > 0) {
            ordenObjeto.productos.push({
                idProducto: productoId,
                cantidad: cantidades.value[productoId],
                precio: encontrarProducto(productos, productoId).precio
            })
        }
    }

    ordenObjeto.total = calcularTotalOrden(ordenObjeto.productos)

    cantidades.value = {}

    ordenesStore.agregarOrden(ordenObjeto)
    props.mesaInfo.estado = 'ocupada';
    mesasStore.modMesa(props.mesaInfo);
    emits('cambiarEstado', props.mesaInfo, props.mesaInfo.estado);  // la funcion recibe 2 argumentos
};

const calcularTotalOrden = productos => {
    let total = 0;
    productos.forEach(producto => total += producto.precio * producto.cantidad)
    return Math.round(total * 100) / 100;  // redondea el total a 2 decimales
}

//Listar productos
const tiposProductos = productosStore.productosTipos

// mostrar el primer acordeon de los tipos de productos abiertos
const monstrarAcordeon = indice => indice === 0 ? 'show' : ''  
//-----------------------------------------------------------

</script>

<template>
    <div class="modal fade " :id="`${modalId}`" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        v-if="jornadaStore.jornadaValor">
        <div class="modal-dialog  modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Órden para la mesa {{ mesaNum }}</h1>

                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">

                    <!-- Acordion -->
                    <form ref="formOrden">
                        <div class="accordion">
                            <div class="accordion-item" v-for="(tipo, index) in tiposProductos" :key="tipo.id">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                        :data-bs-target="`#panel${tipo.id}`" aria-expanded="true"
                                        :aria-controls="`panel${tipo.id}`">
                                        {{ tipo.nombre }}
                                    </button>
                                </h2>
                                <div :id="`panel${tipo.id}`" :class="`accordion-collapse collapse ${monstrarAcordeon(index)}`">
                                    <div class="accordion-body">
                                        <div class="mb-3" v-for="(producto, index) in productos" :key="index">
                                            <template v-if="producto.tipo == tipo.nombre">
                                                <label :for="`Id${producto.id}`" class="form-label">{{ producto.nombre
                                                    }}</label>
                                                <input type="number" class="form-control" :id="`Id${producto.id}`"
                                                    :aria-describedby="producto.nombre" v-model="cantidades[producto.id]">
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-primary" data-bs-dismiss="modal" @click="crearOrden">Ordenar</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" :id="`${modalId}`" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        v-else>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Jornada cerrada</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>No se pueden añadir ordenes porque no hay jornada activa</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>