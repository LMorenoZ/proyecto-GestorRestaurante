<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    import { useUserStore } from '../../stores/users';
    import { useJornadaStore } from '../../stores/jornada';

    // componentes de ui
    import Empleados from '../../components/Admin/Empleados.vue';

    import { titleElemento } from '../../utilidades';
    

    const userStore = useUserStore();
    const jornadaStore = useJornadaStore()
    const router = useRouter()

    // constantes reactivas 
    const botonBorrarDesactivado = ref(false);

</script>

<template>
    <h1>Administracion de Empleados</h1>
    <div class="vw-auto my-3 d-flex justify-content-center" :title="titleElemento('No puede crear un empleado con la jornada activa', jornadaStore.jornadaActiva)">
        <!-- Boton que redirige a vista para crear nuevo empleado -->
        <button type="button" class="btn btn-primary mt-2" @click="router.push('crear_usuario')"  :disabled="jornadaStore.jornadaActiva">Crear nuevo empleado</button>
    </div>

    <!-- Lista de empleados -->
    <div class="mt-4" v-if="userStore.trayendoEmpleados" >
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando información</span>
            </div>
        </div>
    </div>
    <template v-else-if="!userStore.trayendoEmpleados && (userStore.listaEmpleados.length > 0)">
        <Empleados :listaEmpleados="userStore.listaEmpleados" :botonBorrar="botonBorrarDesactivado" />
    </template>
    <div class="mt-4"  v-else="userStore.listaEmpleados.length === 0 ">
        <h3 class="fs-3 text-center">No hay empleados todavía...</h3>
    </div>
    
</template>