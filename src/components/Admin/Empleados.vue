<!-- Javascript del componente -->
<script setup>
    // importaciones de vue
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    // stores de pinia
    import { useUserStore } from '../../stores/users';

    // Se importan componentes
    import ModalConfirmacion from '../ModalConfirmacion.vue'

    // props    que vienen de la vista padre 'AdminEmpleadosView.vue'
    const props = defineProps(['listaEmpleados'])


    // inicializando importaciones
    const router = useRouter()

    // inicializando stores
    const userStore = useUserStore()

    // valores reactivos
    const botonBorrarDesactivado = ref(false)

    // funciones de utilidades
    import { nombreUsuario } from '../../utilidades'

    const borrarEmpleado = async (empleado) => {
        botonBorrarDesactivado.value = true;
        await userStore.deleteEmpleado(empleado);
        botonBorrarDesactivado.value = false;
    };
</script>

<!-- HTML del componente -->
<template>
    <div class="my-4" style="overflow: scroll; height: 70vh">
        <h3 class="fs-3">Lista de empleados:</h3>
        <table class="table table-hover ">
            <thead>
                <tr>
                    <th scope="col">Foto</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Puesto</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Borrar</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="empleado in props.listaEmpleados"  :key="empleado.email">
                    <tr style="cursor: pointer;" @click="router.push(`/administracion/perfil/${empleado.uid}`)">                        
                        <td><img class="img-thumbnail" :src="empleado.foto" alt=""></td>
                        <td>{{ `${empleado.nombre} ${empleado.apellido}` }}</td>
                        <td>{{ empleado.tel }}</td>
                        <td>{{empleado.email}}</td>
                        <td>{{empleado.puesto}}</td>
                        <td>{{ empleado.logeado ? 'Activo' : 'No activo' }}</td>
                        <td >
                            <button 
                                class="btn btn-sm fs-4" 
                                data-bs-toggle="modal" :data-bs-target="`#modalBorrarEmpleado${empleado.uid}`"
                                :disabled="botonBorrarDesactivado"
                            >
                                <span class="badge bg-danger rounded-pill ">
                                    <i class="bi bi-x fs-5"></i>
                                </span>
                            </button>
                            <ModalConfirmacion
                                :id="`modalBorrarEmpleado${empleado.uid}`"
                                :titulo="`Borrar a ${nombreUsuario(empleado.email)}`"
                                :cuerpo="`¿Está seguro que quiere eliminar al empleado ${nombreUsuario(empleado.email)}? Esta opción no se puede deshacer.`"
                                texto-boton="Eliminar empleado"
                                color="danger"
                                @accion="borrarEmpleado"
                                :param="empleado"
                            />
                        </td>
                        <td>
                            <!-- <RouterLink :to="`/administracion/perfil/${empleado.uid}`">Ver</RouterLink> -->
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<!-- Estilos CSS de este componente -->
<style scoped>

</style>