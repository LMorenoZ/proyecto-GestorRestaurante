<script setup>
    // librerias de vue y afiliados
    import { ref, computed } from 'vue'; 
    
    // stores de pinia
    import { useOrdenesStore } from '../stores/ordenes.js';

    // importando componentes de ui
    import Ticket from './Ticket.vue';

    // definiendo las props del componente
    const props = defineProps(['orden', 'mesaNum']);    

    // instanciando las stores
    const ordenesStore = useOrdenesStore();
    //---------------------------------------------

    // variables reactivas
    const ordenActual = ref(props.orden);
    const colorOrden = ref('');
    const estadoDescri = ref('');
    const estadoOrden = ref(props.orden.estado);

    // metodos
    const cambiarColor = color => {
        switch (color) {
            case 'preparacion': 
                colorOrden.value = 'success';
                estadoDescri.value = "Orden en curso"
                break;

            case 'completada': 
                colorOrden.value = 'primary';
                estadoDescri.value = "Orden completada"
                break;

            case 'retrasada': 
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


    // Propiedades computadas
    const costoTotal = computed(() => {  // calcula el total a pagar 
        let total = 0;
        let USDollar = new Intl.NumberFormat('en-US', {  // Para formatear el precio en dolares
            style: 'currency',
            currency: 'USD',
        });

        total += props.orden.queso * 0.5;
        total += props.orden.revueltas * 0.5;
        total += props.orden.chicharron * 0.5;
        total += props.orden.gaseosa * 1;
        total += props.orden.refresco * 1;
        total += props.orden.chocolate * 1;

        return USDollar.format(total);
    });

    const fecha = computed(() => { // Devuelve la fecha de la orden en una apariencia que puede ser entendida
        let hora = "";
        hora = props.orden.fecha.toDate().toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
        return hora;
    });
</script>

<template>
    <div :class="`card m-3 bg-${colorOrden}`" style="width: 18rem;">
        <div class="card-header d-flex justify-content-between fw-bold">
            <p>Órden mesa {{ orden.mesaNum }}</p>
            <div class="badge bg-scondary text-wrap" style="width: 6rem;">
                {{estadoDescri}}
            </div>
        </div>
        <ul class="list-group list-group-flush">
            <p class="fst-italic fw-bold text-light text-end" style="font-size: 0.7rem;">Id órden: {{ orden.id }}</p>
            <p class="fst-italic fw-bold text-light text-end" style="font-size: 0.7rem;">Fecha: {{ fecha }}</p>
            <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}`" v-if="orden.queso">
                Queso: 
                <span class="badge bg-primary rounded-pill">{{ orden.queso }}</span>
            </li>
            <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}`" v-if="orden.revueltas">
                Revueltas: 
                <span class="badge bg-primary rounded-pill">{{ orden.revueltas }}</span>
            </li>
            <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}`" v-if="orden.chicharron">
                Chicharron: 
                <span class="badge bg-primary rounded-pill">{{ orden.chicharron }}</span>
            </li>
            <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}`" v-if="orden.gaseosa">
                Gaseosa: 
                <span class="badge bg-primary rounded-pill">{{ orden.gaseosa }}</span>
            </li>
            <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}` " v-if="orden.refresco">
                Refresco: 
                <span class="badge bg-primary rounded-pill">{{ orden.refresco }}</span>
            </li>
            <li :class="`list-group-item d-flex justify-content-between align-items-center bg-${colorOrden}`" v-if="orden.chocolate">
                Chocolate: 
                <span class="badge bg-primary rounded-pill">{{ orden.chocolate }}</span>
            </li>
            <li :class="`list-group-item bg-${colorOrden} text-light`">
                Total: {{ costoTotal }} 
            </li>
        </ul>
        <div class="card-footer text-light mt-auto">
            <p>Cambiar estado:</p>
            
            <select class="form-select form-select-sm" v-model="estadoOrden">
                <option disabled value="">Seleccione una</option>
                <option value="preparacion">En preparacion</option>
                <option value="retrasada">Orden retrasada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
            </select>
            <div class="d-flex justify-content-between mt-1">
                <button type="button" class="btn btn-sm btn-info" data-bs-toggle="modal" :data-bs-target="`#ticketModal${orden.id}`">
                    Ver ticket
                </button>
                <button class="btn btn-sm btn-primary" @click="modificarOrden(ordenActual)">Actualizar</button>
            </div>
        </div>
    </div>
    
    <Ticket :modalId="orden.id" :ordenInfo="ordenActual" :totalPagar="costoTotal"></Ticket>
</template>