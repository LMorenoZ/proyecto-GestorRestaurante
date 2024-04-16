<script setup>
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';

    import { useUserStore } from '../../stores/users';
    import { useMensajesStore } from '../../stores/mensajes';

    import { nombreUsuario, fechaFormateadaCorta } from '../../utilidades';

    // componentes de ui
    import ModalConfirmacion from '../../components/ModalConfirmacion.vue';
    import Empleados from '../../components/Admin/Empleados.vue';
    

    const userStore = useUserStore();
    const mensajesStore = useMensajesStore();

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
    <h3>Crear nuevo empleado</h3>
    <!-- Aniadir empleados -->
    <form @submit.prevent="crearUsuario" class="col-sm-12 col-md-6  mt-3">
        <div class="">
            <div class="input-group mb-3">
                <span class="input-group-text fw-bold" id="emailUsuario">Email:</span> 
                <input type="email" id="emailUsuario" placeholder="email" class="form-control" v-model.trim="email">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text fw-bold" id="passUsuario">Contraseña del empleado:</span>
                <input type="text" id="passUsuario" placeholder="pass" class="form-control" v-model.trim="pass">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text fw-bold" id="puestoUsuario">Puesto del empleado:</span>
                <select class="form-select" id="puestoUsuario" v-model.trim="puestoEmpleado">
                    <option disabled value="">Elija uno</option>
                    <option>Caja</option>
                    <option>Cocina</option>
                    <option>Mesero</option>
                </select>
            </div>
            <div class="mt-2">
                
            </div>
        </div>
        <div class="vw-auto d-flex justify-content-end">
            <button type="submit" class="btn btn-primary mt-2" :disabled="botonCrearDesactivado">Crear empleado</button>
            <RouterLink to="crear_usuario">Vista crear empleado</RouterLink>
        </div>
    </form>

    <!-- Lista de empleados -->
    <template v-if="userStore.listaEmpleados.length > 0">
        <Empleados :listaEmpleados="userStore.listaEmpleados" :botonBorrar="botonBorrarDesactivado" />
    </template>
    <div class="mt-4" v-else>
        <h3 class="fs-3">No hay empleados todavía...</h3>
    </div>
</template>