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
    <div class="col-sm-12 col-md-6 col-lg-4 mx-auto mt-3 h-100  mt-auto mb-auto" v-if="!userStore.userData">
        <h1>Debe ingresar sesion</h1>


        <form @submit.prevent="ingresar(email, pass)">
            <div class="mb-3">
                <label for="inputEmail" class="form-label">Ingrese email:</label>
                <input type="email" class="form-control" id="inputEmail" v-model="email">
            </div>
            <div class="mb-3">
                <label for="inputPass" class="form-label">Contraseña:</label>
                <input type="password" class="form-control" id="inputPass" v-model="pass">
            </div>
            <button type="submit" class="btn btn-success ml-auto">Ingresar sesión</button>
        </form>
    </div>
</template>