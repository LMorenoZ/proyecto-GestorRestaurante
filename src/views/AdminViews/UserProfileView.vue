<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore/lite";
import { useUserStore } from '../../stores/users';
import { useMensajesStore } from '../../stores/mensajes';
import { fechaFormateada } from '../../utilidades';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const mensajeStore = useMensajesStore()
const empleadoInfo = ref(null)
const colorEstado = ref(null)
const mostrarImagen = ref(false)

const traerInfoEmpleado = async () => {
  try {
    const docRef = doc(db, "empleado", route.params.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      empleadoInfo.value = docSnap.data();
      colorEstado.value = empleadoInfo.value.logeado ? 'success' : 'secondary'  
    } else {
      mensajeStore.crearMensaje({
        titulo: 'No existe usuario', 
        texto: `No existe información del usuario`, 
        color: 'warning', 
        id: 'mensajeNoHayPerfil',
        autoEliminar: false
      });      
      console.log("No such document!");
    }
  } catch (error) {
    mensajeStore.crearError('noTraePerfil', 'No se pudo recuperar la información del perfil de este usuario');
    console.log(error)
  }
}

traerInfoEmpleado()
</script>

<template>
  <div class="container pt-4">
    <div class="card border-0 shadow">
      <div class="row g-0">
        <template v-if="empleadoInfo">
        <div class="col-md-4 d-flex align-items-center justify-content-center" >
          <img class="img-thumbnail rounded-circle profile-picture" :src="empleadoInfo && empleadoInfo.foto" alt="Foto de perfil" @click="mostrarImagen = true">
          <!-- Modal para mostrar la imagen en pantalla completa -->
          <div class="modal" :class="{ 'show': mostrarImagen }" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Foto de perfil</h5>
                  <button type="button" class="btn-close" @click="mostrarImagen = false"></button>
                </div>
                <div class="modal-body">
                  <img :src="empleadoInfo && empleadoInfo.foto" class="img-fluid" alt="Foto de perfil" style="max-width: 100%; max-height: 80vh;">
                </div>
              </div>
            </div>
          </div>
          <!-- Fondo oscuro para el modal -->
          <div class="modal-backdrop fade" :class="{ 'show': mostrarImagen }" @click="mostrarImagen = false"></div>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h1  >{{ empleadoInfo.nombre }} {{ empleadoInfo.apellido }}</h1>
            <h4  >{{ empleadoInfo.puesto }}</h4>
            <span  :class="`badge rounded-pill bg-${colorEstado}`">{{ empleadoInfo.logeado ? 'Activo' : 'No activo'}}</span>
            <hr >
            <div class="info-section">
              <h3 class="section-title fw-bold ">Información</h3>
              <div class="info-item my-2">
                <span class="item-title fw-bold ">Dirección: </span>
                <span>{{ empleadoInfo.direccion }}</span>
              </div>
              <div class="info-item my-2">
                <span class="item-title fw-bold ">Email: </span>
                <span>{{ empleadoInfo.email }}</span>
              </div>
              <div class="info-item my-2">
                <span class="item-title fw-bold ">Teléfono: </span>
                <span>{{ empleadoInfo.tel }}</span>
              </div>
              <div class="info-item my-2">
                <span class="item-title fw-bold ">DUI: </span>
                <span>{{ empleadoInfo.dui }}</span>
              </div>
              <div class="info-item my-2">
                <span class="item-title fw-bold ">Fecha de creación: </span>
                <span>{{ fechaFormateada(empleadoInfo.creation.toDate()) }}</span>
              </div>
            </div>
            <div class="d-flex justify-content-center">

              <button type="button" class="btn btn-outline-primary btn-lg mt-3" @click="router.push('/administracion/empleados')">Regresar</button>
            </div>
          </div>
        </div>
      </template>
      <div v-else>
        Cargando información...
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-picture {
  max-width: 200px;
  max-height: 200px;
  cursor: pointer; /* Cambia el cursor al hacer hover sobre la imagen */
}

/* Estilos para el modal */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1050;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.modal.show {
  display: block;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Fondo oscuro semi-transparente */
  z-index: 1040; /* Asegura que la capa de fondo esté detrás del modal */
  pointer-events: none; /* Permite clics a través del fondo oscuro */
}
</style>
