<script setup>
    // librerias de vue
    import { computed } from 'vue';

    // importando componentes de ui
    import OrdenMesa from '../components/OrdenMesa.vue';
    import TabsOrdenes from '../components/TabsOrdenes.vue';

    // importando stores de pinia
    import { useUserStore } from '../stores/users';
    import { useJornadaStore } from '../stores/jornada';

    // instanciando stores
    const userStore = useUserStore();
    const jornadaStore = useJornadaStore()
    //-----------------------------------------------

    

</script>

<template>
    <h1>Órdenes</h1>
    <button 
        class="btn btn-secondary col-sm-8 col-md-3 ml-auto" 
        v-if="userStore.esAdmin && jornadaStore.jornadaValor"
        @click="jornadaStore.terminarJornada"
    >Terminar jornada</button>
    <div class="row">
        <TabsOrdenes v-if="jornadaStore.jornadaValor" />
        <div v-else>
            <p>No ha empezado la jornada todavia</p>
            <button class="btn btn-success col-sm-8 col-md-3" 
                v-if="userStore.esAdmin && !jornadaStore.jornadaValor"
                @click="jornadaStore.empezarJornada"
            >Empezar jornada</button>
        </div>
        
    </div>
</template>