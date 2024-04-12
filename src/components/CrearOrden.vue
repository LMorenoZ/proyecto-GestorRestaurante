<script setup>
// librerias
import { ref, computed, onMounted } from 'vue';

// stores de pinia
import { useOrdenesStore } from '../stores/ordenes.js';
import { useJornadaStore } from '../stores/jornada.js';
import { useMesasStore } from '../stores/mesas.js';
import { useBodegaStore } from '../stores/bodega.js';
import { useProductosStore } from '../stores/productos.js';
import { useUserStore } from '../stores/users.js';
import { encontrarProducto } from '../utilidades.js';

// props y emits
const props = defineProps(['modalId', 'mesaNum', 'mesaInfo']);
const emits = defineEmits(['cambiarEstado']);

// instancia de las stores
const ordenesStore = useOrdenesStore();
const jornadaStore = useJornadaStore();
const mesasStore = useMesasStore();
const bodegaStore = useBodegaStore();
const productosStore = useProductosStore()
const usersStore = useUserStore()
//-----------------------------------------------------------

const productos = productosStore.productos

const cantidades = ref({});

const crearOrden = () => {
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
    return Math.round(total * 100)/100;  // redondea el total a 2 decimales
}

//Pupuseria
//-----------------------------------------------------------

// // Seguimiento de la orden
// const pupusasQueso = ref(0);
// const pupusasRevueltas = ref(0);
// const pupusasChicharron = ref(0);
// const gaseosa = ref(0);
// const refresco = ref(0);
// const chocolate = ref(0);

// // metodo computado para determinar si se puede ordenar
// const puedeOrdenar = computed(() => {
//     if(
//         pupusasQueso.value > 0 ||
//         pupusasRevueltas.value > 0 ||
//         pupusasChicharron.value > 0 ||
//         gaseosa.value > 0 ||
//         refresco.value > 0 ||
//         chocolate.value > 0
//     ) {
//         return true;
//     } else {
//         return false;
//     }
// });

// // Metodo para realizar la orden para la mesa
// const ordenar = () => {
//     const orden = {
//         queso: pupusasQueso.value,
//         revueltas: pupusasRevueltas.value,
//         chicharron: pupusasChicharron.value,
//         gaseosa: gaseosa.value,
//         refresco: refresco.value,
//         chocolate: chocolate.value,
//         estado: 'preparacion',
//         mesaNum: props.mesaNum,
//         pago: 0
//     };

//     ordenesStore.agregarOrden(orden);
//     props.mesaInfo.estado = 'ocupada';
//     mesasStore.modMesa(props.mesaInfo);
//     emits('cambiarEstado', props.mesaInfo, props.mesaInfo.estado);  // la funcion recibe 2 argumentos
// };  
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
                    <!-- Gestor Restaurante -->
                    <form @submit.prevent="crearOrden">
                        <div class="mb-3" v-for="(producto, index) in productos" :key="index">
                            <label :for="`Id${producto.id}`" class="form-label">{{ producto.nombre }}</label>
                            <input type="number" class="form-control" :id="`Id${producto.id}`"
                                :aria-describedby="producto.nombre" v-model="cantidades[producto.id]">
                        </div>
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Ordenar</button>
                    </form>

                </div>

                <div class="modal-footer">
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