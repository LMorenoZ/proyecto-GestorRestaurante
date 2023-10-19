<script setup>
    // Componentes de ui
    import OrdenMesa from './OrdenMesa.vue';

    // importando stores
    import { useOrdenesStore } from '../stores/ordenes';

    // instanciando ordenes
    const ordenesStore = useOrdenesStore();
</script>

<template>
    <!-- Seleccion de tabs -->  
    <ul class="nav nav-tabs" id="ordenesTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="ordenesActivas-tab" data-bs-toggle="tab" data-bs-target="#ordenesActivas" type="button" role="tab" aria-controls="ordenesActivas" aria-selected="true">Ordenes activas</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="ordenesCompletadas-tab" data-bs-toggle="tab" data-bs-target="#ordenesCompletadas" type="button" role="tab" aria-controls="ordenesCompletadas" aria-selected="false">Ordenes completadas</button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="ordenesCanceladas-tab" data-bs-toggle="tab" data-bs-target="#ordenesCanceladas" type="button" role="tab" aria-controls="ordenesCanceladas" aria-selected="false">Ordenes canceladas</button>
        </li>
    </ul>

    <!-- Contenido de los tabs -->
    <div class="tab-content" id="ordenesTabContent">
        <div class="tab-pane fade show active" id="ordenesActivas" role="tabpanel" aria-labelledby="ordenesActivas-tab">
            <!-- Primero mostrar ordenes retrasadas -->
            <h3>Retrasadas</h3>
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'retrasada'"
                        :orden="orden"
                    />
                </template> 
            </div>
            <hr>
            <!-- Luego mostrar ordenes activas pero no prioritarias -->
            <h3>En curso</h3>
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'preparacion'"
                        :orden="orden"
                    />
                </template> 
            </div>
        </div>
        <div class="tab-pane fade" id="ordenesCompletadas" role="tabpanel" aria-labelledby="ordenesCompletadas-tab">
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'completada'"
                        :orden="orden"
                    />
                </template> 
            </div>
        </div>
        <div class="tab-pane fade" id="ordenesCanceladas" role="tabpanel" aria-labelledby="ordenesCanceladas-tab">
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'cancelada'"
                        :orden="orden"
                    />
                </template> 
            </div>
        </div>
    </div>
</template>