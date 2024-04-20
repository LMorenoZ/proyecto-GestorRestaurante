<script setup>
// librerias de vue y afiliados
import { ref, computed} from 'vue';

// stores de pinia
import { useOrdenesStore } from '../stores/ordenes.js';

// importando componentes de ui
import Ticket from './Ticket.vue';

//importando otros modulos
import { USDollar, encontrarProducto, horaFormateada, printf } from '../utilidades';

// definiendo las props del componente
const props = defineProps(['orden', 'mesaNum', 'productos']);

// instanciando las stores
const ordenesStore = useOrdenesStore();
//---------------------------------------------

// variables reactivas
const ordenActual = computed( () => props.orden );
const colorOrden = ref('');
const estadoDescri = ref('');
const estadoOrden = ref(props.orden.estado);
const productos = ref(props.productos)  // todos los productos del local

// metodos
const cambiarColor = color => {
    switch (color) {
        case 'preparacion':
            colorOrden.value = 'info';
            estadoDescri.value = "Orden en curso"
            break;

        case 'completada':
            colorOrden.value = 'warning-subtle';
            estadoDescri.value = "Orden completada"
            break;

        case 'tardada':
            colorOrden.value = 'warning';
            estadoDescri.value = "Orden retrasada. Priorizar.";
            break;

        case 'cancelada':
            colorOrden.value = 'danger';
            estadoDescri.value = "Orden cancelada";
            break;

        default:
            break;
    }
}
cambiarColor(ordenActual.value.estado);  // se llama la funcion inmediatamente con parametros de este componente en particular

const modificarOrden = async (orden) => {
    const ordenActualizada = orden;
    ordenActualizada.estado = estadoOrden.value;

    ordenesStore.actualizarOrden(ordenActualizada);
    colorOrden.value = ordenActual.value.estado;
    cambiarColor(ordenActual.value.estado);
};

// // TODO: Para poder mover la orden a 'tardada' si pasa un tiempo:
// let fechaMaxima = ordenActual.value.fechaCreacion.toDate().getTime() + 20 * 60 * 1000  // hora maxima hasta que se considera retrasada
// let horaActual = Date.now()  // hora actual en milisegundos

// let tiempoRestante = fechaMaxima - horaActual // diferencia del momento actual con la fehca maxima

// tiempoRestante = tiempoRestante < 0 ? 0 : tiempoRestante  // para no tener tiempo negativo por cualquier razon

// // console.log('Minutos restantes:', tiempoRestante / 60000 ) 

// if (ordenActual.value.estado === 'preparacion') {  // solo afecta a ordenes en estado 'preparacion'
// // if (!ordenActual.value.cronometro && ordenActual.value.estado === 'preparacion') {  // solo afecta a ordenes en estado 'preparacion'
//     // funcion que automaticamente mueve la orden a 'tardada' si pasa un tiempo
//     // ordenesStore.activarCronometro(ordenActual.value, true)  // informa a la orden que el cronometro esta activo
//     console.log('hola')
//     setTimeout(() => {
//         estadoOrden.value = 'tardada'
//         modificarOrden(ordenActual.value)
//     // }, tiempoRestante);
//     }, 5000);
//     // 1200000 : 20 minutos
// }
</script>

<!-- HTML del componente -->
<template>

    <!-- Diseño provisonal del card para las órdenes: -->
    <template v-if="ordenActual">
        <div :class="`card m-3 bg-${colorOrden}`" style="width: 18rem;" >
            <div class="card-header d-flex justify-content-between fw-bold">
                <p>Órden mesa {{ orden.mesaNum }}</p>
                <div class="badge bg-scondary text-wrap text-black" style="width: 6rem;">
                    {{ estadoDescri }}
                </div>
            </div>
            <ul class="list-group list-group-flush">
                <p class="fst-italic fw-bold text-end mt-1" style="font-size: 0.7rem;">Fecha: {{
                horaFormateada(orden.fechaCreacion.toDate()) }}</p>


                <template v-for="producto in ordenActual.productos" :key="producto.idProducto">
        
                    <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}`">
                        {{ encontrarProducto(productos, producto.idProducto).nombre }}
                        <span class="badge bg-primary rounded-pill">
                            {{ producto.cantidad }}
                        </span>
                    </li>     
                </template>
    
                <li :class="`list-group-item bg-${colorOrden}`">
                    Total: {{ USDollar.format(ordenActual.total) }}
                </li>
            </ul>

            <div class="card-footer mt-auto"
                v-if="!(ordenActual.estado === 'preparacion' || ordenActual.estado === 'tardada')">
                <p>Cambiar estado:</p>
                
                <select class="form-select form-select-sm" v-model="estadoOrden">
                    <option disabled value="">Seleccione una</option>
                    <option value="preparacion">En preparacion</option>
                    <option value="tardada">Orden retrasada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
                <div class="d-flex justify-content-between mt-1">
                    <button class="btn btn-sm btn-primary" @click="modificarOrden(ordenActual)" 
                    :disabled="orden.estado === estadoOrden">
                        Actualizar
                    </button>
                </div>
            </div>
                <button type="button" class="btn btn-sm btn-success" data-bs-toggle="modal"
                    :data-bs-target="`#ticketModal${orden.id}`"
                >
                    {{ (ordenActual.estado === 'preparacion' || ordenActual.estado === 'tardada') ? 'Pasar a caja' : 'Ver productos' }}
                </button>
        </div>

    </template>
    
    <div v-else>
        Cargando información...
    </div>

    <!-- Componente que carga un modal con el ticket de la orden -->
    <Ticket :modalId="orden.id" :ordenInfo="ordenActual" :productos="productos"></Ticket>
</template>

<!-- CSS del componente -->
<style scoped>

</style>