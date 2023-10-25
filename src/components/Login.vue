<script setup>
    // librerias
    import { ref } from 'vue'; 
    
    // stores de pinia
    import { useUserStore } from '../stores/users';

    // importaciones de constantes
    import router from '../router';

    // instancias de stores
    const userStore = useUserStore();
    //-------------------------------------------------

    // variables reactvias
    const email = ref('admin@test.com');
    const pass = ref('admin123');

    // metodos
    const ingresar = async (correo, contra) => {
        await userStore.loginUser(correo, contra);
        router.push('/mesas');        
    }
</script>

<template>
    <div class="d-flex flex-column align-items-center justify-content-center  login-div" v-if="!userStore.userData">
        <div class="bg-info rounded p-4 col-sm-12 col-lg-6 div-fondo">
            <h1 class="text-light">Debe ingresar sesion</h1>


            <form @submit.prevent="ingresar(email, pass)">
                <div class="d-flex flex-column">
                    <div class="mb-3">
                        <label for="inputEmail" class="form-label">Ingrese email:</label>
                        <input type="email" class="form-control" id="inputEmail" v-model="email">
                    </div>
                    <div class="mb-3">
                        <label for="inputPass" class="form-label">Contraseña:</label>
                        <input type="password" class="form-control" id="inputPass" v-model="pass">
                    </div>
                </div>
                <button type="submit" class="btn btn-success btn-submit">Ingresar sesión</button>
            </form>
        </div>
    </div>
</template>

<style>
    .login-div {
        height: 90vh;
    }

    .btn-submit {
        margin-left: 22vw;
    }

    .div-fondo {
        height: 40vh;
    }
</style>