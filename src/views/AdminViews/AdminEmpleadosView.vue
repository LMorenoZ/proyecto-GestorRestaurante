<script setup>
    import { ref } from 'vue';
    import { RouterLink, useRouter } from 'vue-router';

    import { useUserStore } from '../../stores/users';
    import { useMensajesStore } from '../../stores/mensajes';

    import { nombreUsuario, fechaFormateadaCorta } from '../../utilidades';

    // componentes de ui
    import ModalConfirmacion from '../../components/ModalConfirmacion.vue';
    import Empleados from '../../components/Admin/Empleados.vue';
    

    const userStore = useUserStore();
    const mensajesStore = useMensajesStore();
    const router = useRouter()

    // constantes reactivas 
    const email = ref('empleado2@test.com');
    const pass = ref('empleado2');
    const puestoEmpleado = ref('');
    const botonCrearDesactivado = ref(false);
    const botonBorrarDesactivado = ref(false);

    // metodos
    const crearUsuario = async () => {
        // validacion de inputs
        if (email.value === '' || pass.value === '' || pass.value.length < 6 || puestoEmpleado.value === '') {
            mensajesStore.crearMensaje({
                titulo: 'Llene los campos',
                texto: 'No puede crear un nuevo empleado sin todos sus datos. La contraseña debe contener mínimo 6 caracteres',
                color: 'warning',
                id: 'usuarioNoCreadoCampos',
                autoEliminar: true
            });
            return
        }

        botonCrearDesactivado.value = true;
        await userStore.createUser(email.value, pass.value, puestoEmpleado.value);

        email.value = '';
        pass.value = '';
        puestoEmpleado.value = '';
        botonCrearDesactivado.value = false;
    }
    userStore.getEmpleados();
</script>

<template>
    <h1>Administracion de Empleados</h1>
    <div class="vw-auto my-3 d-flex justify-content-center">
        <button type="button" class="btn btn-primary mt-2" @click="router.push('crear_usuario')">Crear nuevo empleado</button>
    </div>

    <!-- Lista de empleados -->
    <template v-if="userStore.listaEmpleados.length > 0">
        <Empleados :listaEmpleados="userStore.listaEmpleados" :botonBorrar="botonBorrarDesactivado" />
    </template>
    <div class="mt-4" v-else>
        <h3 class="fs-3">No hay empleados todavía...</h3>
    </div>
</template>