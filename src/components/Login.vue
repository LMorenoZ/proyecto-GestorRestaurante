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
const pass = ref('123456');

// variable reactiva para mostrar el alert de erro de iniciar sesion
let hayError = ref(false);

// variable normal para saber si el alert de error ha sido cerrado
const borrarError = () => {
  hayError.value = false;
};

// metodos
const ingresar = async (correo, contra) => {
  try {
    await userStore.loginUser(correo, contra);
    // redirecciona al usuario a la vista mas apropiada para su rol
    if (userStore.userRol === 'Mesero') {
      router.push('/mesas');
    } else if (userStore.userRol === 'Cocina' || userStore.userRol === 'Caja') {
      router.push('/ordenes');
    } else if (userStore.userRol === 'admin') {
      router.push('/administracion');
    }
  } catch (error) {
    hayError.value = true;
    console.log(error);
  }
};

// importar imagen del formulario de login
import LaurelesLogo from '../assets/LogoMD.jpg'

// emits que vienen de la vista Home
const emit = defineEmits(['cambiarFormulario'])

// activa la funcion emit de la vista 'HomeView' para cambiar al formulario de recuperacion de contrasenia
const recuperarPass = () => {
  emit('cambiarFormulario')
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center align-items-center vh-100">
      <div class="col-md-6">
        <div class="card bg-white text-dark">
          <div class="card-body">
            <!-- Alerta de error -->
            <Alerta
              @click="borrarError"
              v-if="hayError"
              titulo="Error al intentar iniciar sesión"
              texto="Credenciales erróneas o algún un problema en el servidor"
              color="danger"
            />

            <div class="d-flex justify-content-center">
              <div class="circle-background" :style="{ backgroundImage: `url(${LaurelesLogo})` }">
              </div>
            </div>

            <div class="card-header fw-bolder text-center">Iniciar Sesión</div>
            <form @submit.prevent="ingresar(email, pass)">
              <div class="form-group">
                <label for="inputEmail" class="fw-bolder">Usuario:</label>
                <input
                  type="email"
                  class="form-control custom-input"
                  id="inputEmail"
                  placeholder="Ingresa tu correo electrónico"
                  v-model="email"
                />
              </div>
              <div class="form-group mt-3">
                <label for="inputPass" class="fw-bolder">Contraseña:</label>
                <input
                  type="password"
                  class="form-control custom-input"
                  id="inputPass"
                  placeholder="Ingresa tu contraseña"
                  v-model="pass"
                />
              </div>
              <div
                class="d-flex justify-content-between align-items-center mt-4"
              >
                <div>
                  <div>
                    <button type="submit" class="btn btn-success btn-submit">
                      Iniciar Sesión
                    </button>
                  </div>
                </div>

                <div>
                  <span class="forgot-password" @click="recuperarPass">¿Olvidó su contraseña?</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-input {
  border-radius: 10px; /* Bordes redondeados */
  border: 1px solid #ced4da; /* Borde */
  padding: 10px; /* Espaciado interno */
  transition: border-color 0.3s ease; /* Transición suave del color del borde */

  /* Estilo al enfocar el input */
  &:focus {
    border-color: #5cb85c; /* Color del borde al enfocar */
    box-shadow: 0px 0px 5px rgba(92, 184, 92, 0.5); /* Sombra al enfocar */
  }
}
.btn-submit {
  border-radius: 20px; /* Bordes redondeados */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Sombra */
  transition: all 0.3s ease; /* Transición suave */

  /* Efecto de zoom */
  transform: scale(1);
  transition: transform 0.3s ease;
}

.btn-submit:hover {
  background-color: #5cb85c; /* Cambio de color al pasar el mouse */
  transform: scale(1.1); /* Efecto de zoom al pasar el mouse */
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.2); /* Sombra más pronunciada */
}

.btn-submit:focus {
  outline: none; /* Eliminar el borde al hacer clic */
}

.circle-background {
  width: 150px; /* Ajusta el tamaño del círculo según necesites */
  height: 150px; /* Ajusta el tamaño del círculo según necesites */
  border-radius: 50%; /* Hace que el contenedor tenga forma de círculo */
  overflow: hidden; /* Oculta cualquier contenido que sobresalga del círculo */
  background-size: cover;
  background-position: center; /* Centra la imagen dentro del círculo */
  animation: fadeInOut 5s ease alternate infinite;
}

@keyframes fadeInOut {
  0% {
    opacity: 0; /* Estado inicial: completamente transparente */
  }
  50% {
    opacity: 1; /* Estado intermedio: completamente visible */
  }
  100% {
    opacity: 0; /* Estado final: completamente transparente */
  }
}
.bg-white {
  background-color: #ffffff; /* Cambia el color de fondo del card a blanco */
}

.btn-success {
  background-color: #28a745; /* Cambia el color de fondo del botón de inicio de sesión a verde */
  border-color: #28a745; /* Cambia el color del borde del botón de inicio de sesión a verde */
}

.btn-success:hover {
  background-color: #218838; /* Cambia el color de fondo del botón de inicio de sesión cuando se pasa el mouse a un verde más oscuro */
  border-color: #1e7e34; /* Cambia el color del borde del botón de inicio de sesión cuando se pasa el mouse a un verde más oscuro */
}

.forgot-password {
  color: #6c757d; /* Cambia el color del texto "Olvidó su contraseña?" a un tono de gris */
  cursor: pointer; /* Cambia el cursor al pasar sobre el texto "Olvidó su contraseña?" */
}
</style>
