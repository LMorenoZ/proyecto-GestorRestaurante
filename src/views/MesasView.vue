<script setup>
    // importando componentes de ui
    import Mesa from '../components/Mesa.vue';
    import AñadirMesa from '../components/AñadirMesa.vue';

    // importando stores de pinia
    import { useMesasStore } from '../stores/mesas';
    import { useUserStore } from '../stores/users';

    // instanciando stores 
    const mesasStore = useMesasStore();
    const userStore = useUserStore();    
</script>

<template>
    <h1>Disposición de mesas</h1> <br>

    <!-- Botón para añadir nueva mesa -->
    <button 
        class="btn btn-success ml-2 col-sm-10 col-md-2" 
        data-bs-toggle="modal" data-bs-target="#crearMesa" 
        v-if="userStore.userData?.email === 'escuelalaurelessv@gmail.com'"
    >
        Añadir mesa
    </button>
    
    <div class="d-flex flex-wrap">
        <template v-for="mesa in mesasStore.mesas" :key="mesa.mesaNum">
            <Mesa :mesaInfo="mesa" ></Mesa>
        </template>
    </div>
  
    <!-- Modal del boton para aniadir mesa -->
    <AñadirMesa modalId="crearMesa"></AñadirMesa>
</template>