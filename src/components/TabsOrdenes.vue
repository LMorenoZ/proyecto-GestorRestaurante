<script setup>
    // Componentes de ui
    import OrdenMesa from './OrdenMesa.vue';

    // importando stores
    import { useOrdenesStore } from '../stores/ordenes';
    import { useProductosStore } from '../stores/productos';

    // instanciando ordenes
    const ordenesStore = useOrdenesStore();
    const productosStore = useProductosStore()
    //-------------------------------------------
</script>

<template>
    <!-- Seleccion de tabs -->  
    <ul class="nav nav-tabs" id="ordenesTab" role="tablist">
        <li class="nav-item" role="presentation">
            <button class="nav-link active" id="ordenesActivas-tab" data-bs-toggle="tab" data-bs-target="#ordenesActivas" type="button" role="tab" aria-controls="ordenesActivas" aria-selected="true">Ordenes activas <span class="badge text-bg-success">{{ ordenesStore.ordenesActivas }}</span></button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="ordenesCompletadas-tab" data-bs-toggle="tab" data-bs-target="#ordenesCompletadas" type="button" role="tab" aria-controls="ordenesCompletadas" aria-selected="false">Ordenes completadas <span class="badge text-bg-primary">{{ ordenesStore.ordenesCompletadas}}</span></button>
        </li>
        <li class="nav-item" role="presentation">
            <button class="nav-link" id="ordenesCanceladas-tab" data-bs-toggle="tab" data-bs-target="#ordenesCanceladas" type="button" role="tab" aria-controls="ordenesCanceladas" aria-selected="false">Ordenes canceladas <span class="badge text-bg-danger">{{ ordenesStore.ordenesCanceladas }}</span></button>
        </li>
    </ul>

    <!-- Contenido de los tabs -->
    <div class="tab-content" id="ordenesTabContent" v-if="!productosStore.cargando">
        <div class="tab-pane fade show active" id="ordenesActivas" role="tabpanel" aria-labelledby="ordenesActivas-tab">
            <!-- Primero mostrar ordenes retrasadas -->
            <h3>Retrasadas (<span class="fw-bold">{{ ordenesStore.ordenesTardadas }}</span>)</h3>
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'tardada'"
                        :orden="orden"
                        :productos="productosStore.productos"
                    />
                </template> 
                <div v-if="ordenesStore.ordenesTardadas == 0">No hay órdenes retrasadas</div>
            </div>
            <hr>
            <!-- Luego mostrar ordenes activas pero no prioritarias -->
            <h3>En curso (<span class="fw-bold">{{ ordenesStore.ordenesPreparacion }}</span>)</h3>
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'preparacion'"
                        :orden="orden"
                        :productos="productosStore.productos"
                    />
                </template> 
                <div v-if="ordenesStore.ordenesPreparacion == 0">No hay órdenes en preparación</div>
            </div>
        </div>
        <div class="tab-pane fade" id="ordenesCompletadas" role="tabpanel" aria-labelledby="ordenesCompletadas-tab">
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'completada'"
                        :orden="orden"
                        :productos="productosStore.productos"
                    />
                </template> 
                <div v-if="ordenesStore.ordenesCompletadas == 0">No hay órdenes completadas</div>
            </div>
        </div>
        <div class="tab-pane fade" id="ordenesCanceladas" role="tabpanel" aria-labelledby="ordenesCanceladas-tab">
            <div class="d-flex flex-wrap">
                <template v-for="orden in ordenesStore.ordenes" :key="orden.id">
                    <OrdenMesa 
                        v-if="orden.estado === 'cancelada'"
                        :orden="orden"
                        :productos="productosStore.productos"
                    />
                </template> 
                <div v-if="ordenesStore.ordenesCanceladas == 0">No hay órdenes canceladas</div>
            </div>
        </div>
    </div>

    <!-- Reemplazar lo que esta dentro de este div con un loading spinner -->
    <div v-else>
        <div class="spinner-border" role="status">
         <span class="visually-hidden">Cargando...</span>
        </div>
    </div>
    
</template>