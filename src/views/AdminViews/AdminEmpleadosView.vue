<script setup>
    import { ref } from 'vue';

    import { useUserStore } from '../../stores/users';

    import { nombreUsuario, fechaFormateadaCorta } from '../../utilidades';

    const userStore = useUserStore();

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
            alert("No ha llenado los campos");
            return
        }

        botonCrearDesactivado.value = true;
        await userStore.createUser(email.value, pass.value, puestoEmpleado.value);

        email.value = '';
        pass.value = '';
        puestoEmpleado.value = '';
        botonCrearDesactivado.value = false;
    }

    const borrarEmpleado = async (empleado) => {
        botonBorrarDesactivado.value = true;
        await userStore.deleteEmpleado(empleado);
        botonBorrarDesactivado.value = false;
    };

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
                <span class="input-group-text fw-bold" id="puestoUsuario">Puexto del empleado:</span>
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
        </div>
    </form>

    <!-- Lista de empleados -->
    <div class="my-4" v-if="userStore.listaEmpleados.length > 0" style="overflow: scroll; height: 70vh">
        <h3 class="fs-3">Lista de empleados:</h3>
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Usuario</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Puesto</th>
                    <th scope="col">Contraseña</th>
                    <th scope="col">Creación</th>
                    <th scope="col">Acción</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    v-for="(empleado, index) in userStore.listaEmpleados" 
                    :key="empleado.email">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{nombreUsuario(empleado.email)}}</td>
                    <td>{{empleado.email}}</td>
                    <td>{{empleado.puesto}}</td>
                    <td>{{empleado.password}}</td>
                    <td>{{fechaFormateadaCorta(empleado.creation.toDate())}}</td>
                    <td>
                        <button class="btn btn-sm fs-4" @click="borrarEmpleado(empleado)" :disabled="botonBorrarDesactivado">
                            <span class="badge bg-danger rounded-pill ">X</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="mt-4" v-else>
        <h3 class="fs-3">No hay empleados todavía...</h3>
    </div>
</template>