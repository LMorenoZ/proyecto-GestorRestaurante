<!-- Javascript del componente -->
<script setup>
    // importaciones de vue
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    
    // importaciones de stores y demas
    import { useUserStore } from '../../stores/users';
    import { useJornadaStore } from '../../stores/jornada';
    import { useMensajesStore } from '../../stores/mensajes';
    import { storage } from '../../firebaseConfig';
    import { deleteObject, ref as firebaseRef } from 'firebase/storage';

    // Se importan componentes
    import ModalConfirmacion from '../ModalConfirmacion.vue'

    // props    que vienen de la vista padre 'AdminEmpleadosView.vue'
    const props = defineProps(['listaEmpleados'])

    // inicializando importaciones
    const router = useRouter()

    // inicializando stores
    const userStore = useUserStore()
    const jornadaStore = useJornadaStore()
    const mensajesStore = useMensajesStore()

    // valores reactivos
    const botonBorrarDesactivado = ref(false)

    // funciones de utilidades

    const deshabilitarEmpleado = async (empleado) => {
        botonBorrarDesactivado.value = true;

        try {
          // primer paso: borrar la foto Storage
          const refFotoUsuario = firebaseRef(storage, empleado.foto)

          // se elimina la foto de perfil
          await deleteObject(refFotoUsuario)

          // segundo paso: eliminar el registro del usuario de la coleccion de firestore
          await userStore.deactivateEmpleado(empleado);
          // const urlExterna = 'https://console.firebase.google.com/project/db-sistema-gestor/authentication/users'
          // window.open(urlExterna, '_blank');
          mensajesStore.crearMensaje({
            titulo: 'Cuenta deshabilitada',
            texto: `La cuenta del empleado ${empleado.email} fue deshabilitada exitosamente`,
            color: 'secondary',
            id: 'empladoEliminado',
            autoEliminar: true,
          });
        } catch (error) {
          mensajesStore.crearError(
            'noEliminaEmpleado',
            `No se pudo eliminar el empleado ${empleado.email}`
          );
          console.log(error);
        }
        
        botonBorrarDesactivado.value = false;
    };

    const puedeUtilizarBoton = (estadoEmpleado, accion) => {
      let mensaje = null;
      if (estadoEmpleado) {
        mensaje = `Solo puede ${accion} empleados que no estén activos en este momento`
      }

      return mensaje
    }
</script>

<!-- HTML del componente -->
<template>
    <div class="container mt-4">
      <h3 class="text-center mb-4">Lista de Empleados</h3>
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>Puesto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="empleado in props.listaEmpleados" :key="empleado.email">
              <td>
                <div class="photo-container">
                  <img class="img-thumbnail" :src="empleado.foto" alt="" @mouseover="zoomIn" @mouseleave="zoomOut">
                </div>
              </td>
              <td>{{ `${empleado.nombre} ${empleado.apellido}` }}</td>
              <td>{{ empleado.tel }}</td>
              <td>{{ empleado.email }}</td>
              <td>{{ empleado.puesto }}</td>
              <td :style="{ color: empleado.logeado ? 'green' : 'red' }">{{ empleado.logeado ? 'Activo' : 'No activo' }}</td>
              <td>
                <div class="btn-group" role="group">
                  <div :title="puedeUtilizarBoton(empleado.logeado, 'borrar')">
                    <button 
                      class="btn btn-warning btn-sm fs-4"  :class="{'disabled': empleado.logeado}"
                      data-bs-toggle="modal" :data-bs-target="`#modalBorrarEmpleado${empleado.uid}`"
                      
                      :disabled="botonBorrarDesactivado"
                      v-if="!jornadaStore.jornadaActiva"
                    >
                      <i class="bi bi-ban"></i>
                    </button>
                  </div>
                  <div :title="puedeUtilizarBoton(empleado.logeado, 'editar')">
                    <router-link class="btn btn-primary btn-sm fs-4" :class="{'disabled': empleado.logeado}"  :to="`/administracion/editar/${empleado.uid}`" >
                      <i class="bi bi-pencil"></i>
                    </router-link>
                  </div>
                  <router-link class="btn btn-info btn-sm fs-4" :to="`/administracion/perfil/${empleado.uid}`">
                    <i class="bi bi-eye"></i>
                  </router-link>
                </div>
                <ModalConfirmacion
                  :id="`modalBorrarEmpleado${empleado.uid}`"
                  :titulo="`Deshabilitar al usuario ${empleado.email}`"
                  :cuerpo="`¿Está seguro que desea deshabilitar al empleado ${empleado.nombre} ${empleado.apellido}? Esta opción no se puede deshacer`"
                  texto-boton="Deshabilitar empleado"
                  color="warning"
                  @accion="deshabilitarEmpleado"
                  :param="empleado"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <style scoped>
  /* Estilos personalizados */
  .container {
    max-width: 800px;
    margin: auto;
  }
  
  .table {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .table th,
  .table td {
    vertical-align: middle;
  }
  
  .btn-danger,
  .btn-primary,
  .btn-secondary,
  .btn-info {
    padding: 0.3rem; /* Ajuste de tamaño del botón */
    border-radius: 5px; /* Bordes redondeados */
  }
  
  .btn-group {
    display: flex;
    gap: 10px; /* Espacio entre los botones */
  }
  
  .btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }
  
  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
  
  .btn-secondary:hover {
    background-color: #6c757d;
    border-color: #6c757d;
  }
  
  .btn-info:hover {
    background-color: #17a2b8;
    border-color: #17a2b8;
  }
  
  .text-center {
    text-align: center;
  }
  
  .mb-4 {
    margin-bottom: 1.5rem;
  }
  
  .img-thumbnail {
    max-width: 50px;
    border-radius: 50%;
    transition: transform 0.3s ease; /* Transición suave */
  }
  
  .photo-container {
    position: relative;
  }
  
  .photo-container:hover .img-thumbnail {
    transform: scale(1.2); /* Aumenta el tamaño al pasar el mouse */
  }
  </style>
  