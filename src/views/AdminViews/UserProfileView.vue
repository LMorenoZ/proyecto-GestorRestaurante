<!-- Javascript del componente -->
<script setup>
    // importaciones de vue
    import { ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';

    // importaciones de firestore
    import { db } from '../../firebaseConfig';
    import { doc, getDoc } from "firebase/firestore/lite";

    // importando stores de pinia
    import { useUserStore } from '../../stores/users';
    import { useMensajesStore } from '../../stores/mensajes';

    // funciones de utilidades
    import { fechaFormateada, printf } from '../../utilidades';

    // inicializando importaciones
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const mensajeStore = useMensajesStore()

    // objeto con toda la informacion del empleado, identificado por su id
    const empleadoInfo = ref(null)

    // comprobacion del estado del usuario (activo en la aplicacion o no)
    const colorEstado = ref(null)

    // funcion que traera la informacion desde la base de datos en firestore cuado sea llamada
    const traerInfoEmpleado = async () => {
      try {
          const docRef = doc(db, "empleado", route.params.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            empleadoInfo.value = docSnap.data();
            colorEstado.value = empleadoInfo.value.logeado ? 'success' : 'secondary'  
          } else {
            // docSnap.data() will be undefined in this case
            mensajesStore.crearMensaje({
                    titulo: 'No existe usuario', 
                    texto: `No existe información del usuario`, 
                    color: 'warning', 
                    id: 'mensajeNoHayPerfil',
                    autoEliminar: false
                });      
            console.log("No such document!");
          }
      } catch (error) {
          mensajesStore.crearError('noTraePerfil', 'No se pudo recuperar la información del perfil de este usuario');
          console.log(error)
      }
    }

    // se invoca la funcion para traer la info desde la db en firestore
    traerInfoEmpleado()
</script>

<!-- HTML del componente -->
<template>
    <!-- <h1>Perfil de {{ $route.params.id }}</h1> -->

    <!-- HTML provisional para mostrar el perfil de un trabajador -->
    <div class="container pt-2" v-if="empleadoInfo">
        <div class="row pt-2 border border-dark">
          <div class="col p-3 mb-2 ">
                <img class="img-thumbnail" :src="empleadoInfo.foto">
            <h2>{{ empleadoInfo.nombre }} {{ empleadoInfo.apellido }}</h2>
            <h4>{{ empleadoInfo.puesto }}</h4>
            <span :class="`badge rounded-pill text-bg-${colorEstado}`">{{ empleadoInfo.logeado ? 'Activo' : 'No activo'}}</span>
          </div>
          <div class="col-8">
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>  
            <div class="text-center">

            </div> 
            <h3>Informacion</h3>  
            <h4>Direccion: {{ empleadoInfo.direccion }}</h4>
            <h4>Email: {{ empleadoInfo.email }}</h4>
            <h4>Telefono: {{ empleadoInfo.tel }}</h4>
            <h4>DUI: {{ empleadoInfo.dui }}</h4>
            <h4>Fecha creación: {{ fechaFormateada(empleadoInfo.creation.toDate()) }}</h4>
            <br>
            <br>
            <br>
            <button type="button" class="btn btn-outline-primary btn-lg" @click="router.push('/administracion/empleados')">Regresar</button> 
          </div>
        </div>
      </div>
      <div v-else>
        Cargando informacion...
      </div>
</template>

<!-- CSS del componente -->
<style scoped>

</style>