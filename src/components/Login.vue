<script setup>
// librerias
import { ref } from 'vue';

// stores de pinia
import { useUserStore } from '../stores/users';

// importaciones de constantes
import router from '../router';

// componente de ui
import Alerta from './Alertas/Alerta.vue';

// instancias de stores
const userStore = useUserStore();
//-------------------------------------------------

// variables reactvias
const email = ref('admin@test.com');
const pass = ref('admin123');

// variable reactiva para mostrar el alert de erro de iniciar sesion
let hayError = ref(false);

// variable normal para saber si el alert de error ha sido cerrado
const borrarError = () => {
    hayError.value = false;
}

// metodos
const ingresar = async (correo, contra) => {
    try {
        await userStore.loginUser(correo, contra);
        router.push('/mesas');
    } catch (error) {
        hayError.value = true;
        console.log(error);
    }
}
</script>

<template>
    <div class="container mt-5 ">
        <div class="row login-div justify-content-center align-items-center">

            <!-- Alerta de error -->
            <Alerta 
                @click="borrarError"
                v-if="hayError"
                titulo="Error al intentar iniciar sesión"
                texto="Credenciales erróneas o algún un problema en el servidor"
                color="danger"
            />

            <div class="col-md-6 mt-auto mb-auto">
                <div class="card bg-info-subtle py-3">
                    <div class="card-header fw-bolder">
                        Iniciar Sesión
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="ingresar(email, pass)">
                            <div class="form-group ">
                                <label for="inputEmail" class="fw-bolder">Correo Electrónico:</label>
                                <input type="email" class="form-control" id="inputEmail"
                                    placeholder="Ingresa tu correo electrónico" v-model="email">
                            </div>
                            <div class="form-group mt-3">
                                <label for="inputPass" class="fw-bolder">Contraseña:</label>
                                <input type="password" class="form-control" id="inputPass"
                                    placeholder="Ingresa tu contraseña" v-model="pass">
                            </div>
                            <div class="d-flex justify-content-center justify-content-md-end mt-3">
                                <button type="submit" class="btn btn-primary btn-submit">Iniciar Sesión</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<style>
.login-div {
    height: 80vh;
}
</style>