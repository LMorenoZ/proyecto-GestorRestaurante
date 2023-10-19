<script setup>
    // librerias
    import { ref } from 'vue';

    // stores de pinia
    import { useOrdenesStore } from '../stores/ordenes.js';
    import { useJornadaStore } from '../stores/jornada';

    // props
    const props = defineProps(['modalId', 'mesaNum']);

    // instancia de las stores
    const ordenesStore = useOrdenesStore();
    const jornadaStore = useJornadaStore();
    //-----------------------------------------------------------


    // Seguimiento de la orden
    const pupusasQueso = ref(0);
    const pupusasRevueltas= ref(0);
    const pupusasChicharron = ref(0);
    const gaseosa = ref(0);
    const refresco = ref(0);
    const chocolate = ref(0);

    // Metodo para realizar la orden para la mesa
    const ordenar = () => {
        const orden = {
            queso: pupusasQueso.value,
            revueltas: pupusasRevueltas.value,
            chicharron: pupusasChicharron.value,
            gaseosa: gaseosa.value,
            refresco: refresco.value,
            chocolate: chocolate.value,
            estado: 'preparacion',
            mesaNum: props.mesaNum,
            pago: 0
        };

        ordenesStore.agregarOrden(orden);
    };  
</script>

<template>
    <div class="modal fade " :id="`${modalId}`" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" v-if="jornadaStore.jornadaValor">
        <div class="modal-dialog  modal-dialog-scrollable">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Órden para la mesa {{ mesaNum }}</h1>

            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="ordenar">
                    <div class="mb-3">
                        <label for="pupusaQueso" class="form-label">Queso</label>
                        <input type="number" class="form-control" id="pupusaQueso" aria-describedby="queso" v-model="pupusasQueso">
                    </div>
                    <div class="mb-3">
                        <label for="pupusaRevueltas" class="form-label">Revueltas</label>
                        <input type="number" class="form-control" id="pupusaRevueltas" aria-describedby="revuelta" v-model="pupusasRevueltas">
                    </div>
                    <div class="mb-3">
                        <label for="pupusaChicharron" class="form-label">Chicharron</label>
                        <input type="number" class="form-control" id="pupusaChicharron" aria-describedby="chicharron" v-model="pupusasChicharron">
                    </div>
                    <div class="mb-3">
                        <label for="gaseosa" class="form-label">Gaseosa</label>
                        <input type="number" class="form-control" id="gaseosa" aria-describedby="gaseosa" v-model="gaseosa">
                    </div>
                    <div class="mb-3">
                        <label for="refresco" class="form-label">Refresco</label>
                        <input type="number" class="form-control" id="refresco" aria-describedby="refresco" v-model="refresco">
                    </div>
                    <div class="mb-3">
                        <label for="chocolate" class="form-label">Chocolate</label>
                        <input type="number" class="form-control" id="chocolate" aria-describedby="chocolate" v-model="chocolate">
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

    <div class="modal fade" :id="`${modalId}`" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" v-else>
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Jornada cerrada</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p>No se pueden añadir ordenes porque la no hay jornada activa</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>
    </div>
</template>