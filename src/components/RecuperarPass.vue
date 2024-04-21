<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0">Recuperar Contraseña</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="enviarRecuperar" class="recovery-form">
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Correo Electrónico</label>
                <input type="email" class="form-control" id="exampleInputEmail1" v-model="email" placeholder="Escriba su correo electrónico" required>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Enviar</button>
            </form>
          </div>
        </div>
        <div v-if="mensaje" class="alert alert-success mt-3" role="alert">
          {{ mensaje }}
        </div>
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const mensaje = ref('');
const error = ref('');

const enviarRecuperar = () => {
  // Simulación de solicitud de recuperación de contraseña
  if (email.value === 'correo@example.com') {
    mensaje.value = 'Se ha enviado un correo electrónico con instrucciones para recuperar su contraseña.';
    error.value = '';
  } else {
    error.value = 'El correo electrónico ingresado no coincide con ninguna cuenta.';
    mensaje.value = '';
  }
};
</script>

<style scoped>
.container {
  padding-top: 50px;
}

.recovery-form {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 20px;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

</style>
