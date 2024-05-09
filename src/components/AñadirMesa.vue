<script setup>
    // librerias
    import { ref, computed } from 'vue';

    // stores
    import { useMesasStore } from '../stores/mesas';

    // props del componente
    const props = defineProps(['modalId']);

    // instancia de las stores
    const mesasStore = useMesasStore();
    //---------------------------------------------------------

    // constantes reactivas
    const numeroMesa = ref();
    const asientos = ref();

    // metodos
    const añadirMesa = () => {
        const nuevaMesa = {
            mesaNum: numeroMesa.value,
            asientos: asientos.value,
            estado: "libre"
        };

        mesasStore.añadirMesa(nuevaMesa);
        numeroMesa.value = 0;
        asientos.value = 0;        
    };

    // Metodo computado que determina si se puede crear nuevas mesas
    const puedeAñadir = computed(() => (numeroMesa.value > 0) && (asientos.value > 0) );
</script>

<template>
    <div class="modal fade" :id="modalId" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Añadir mesa</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="MesaNum" class="form-label">Numero de mesa:</label>
                        <input type="number" class="form-control" min="1" id="MesaNum" aria-describedby="mesaNum" v-model="numeroMesa">
                    </div>
                    <div class="mb-3">
                        <label for="asientos" class="form-label">Asientos:</label>
                        <input type="number" class="form-control" min="1" id="asientos" aria-describedby="asientos" v-model="asientos">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="añadirMesa" :disabled="!puedeAñadir">Añadir mesa</button>
            </div>
            </div>
        </div>
    </div>
</template>