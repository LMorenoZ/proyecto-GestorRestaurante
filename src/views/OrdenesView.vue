<script setup>
// librerias de vue
import { computed } from 'vue';

// importando componentes de ui
import OrdenMesa from '../components/OrdenMesa.vue';
import TabsOrdenes from '../components/TabsOrdenes.vue';
import ModalConfirmacion from '../components/ModalConfirmacion.vue';

// importando stores de pinia
import { useUserStore } from '../stores/users';
import { useJornadaStore } from '../stores/jornada';

// instanciando stores
const userStore = useUserStore();
const jornadaStore = useJornadaStore()

// metodos de utilidades
import { fechaFormateada, horaFormateada } from '../utilidades';
//-----------------------------------------------
const fechaDeHoy = fechaFormateada(new Date());
const horaActual = horaFormateada(new Date());

</script>

<template>
    <h1>Órdenes</h1>

    <!-- Botón para terminar jornada -->
    <button class="btn btn-secondary col-sm-8 col-md-3 ml-auto" data-bs-toggle="modal" data-bs-target="#modalCerrarJornada"
        v-if="userStore.esAdmin && jornadaStore.jornadaValor">
        Terminar jornada
    </button>
    

    <ModalConfirmacion id="modalCerrarJornada" titulo="Cerrar jornada"
        :cuerpo="`¿Terminar jornada laboral para este día ${fechaDeHoy} a las ${horaActual} ?`" textoBoton="Terminar"
        @accion="jornadaStore.terminarJornada" color="warning" />
    <div class="row">
        <TabsOrdenes v-if="jornadaStore.jornadaValor" />

        <div class="container-fluid d-flex justify-content-center align-items-center text-center" style="height: 50vh;" v-else>
            <div>
                <p class="fw-bolder fs-3">No ha empezado la jornada todavía</p>
                <button class="btn btn-success fs-3" data-bs-toggle="modal"
                    data-bs-target="#modalIniciarJornada" v-if="userStore.esAdmin && !jornadaStore.jornadaValor">
                    Empezar jornada
                </button>
                <ModalConfirmacion id="modalIniciarJornada" titulo="Iniciar jornada"
                    :cuerpo="`¿Empezar jornada laboral para este día ${fechaDeHoy} a las ${horaActual} ?`"
                    textoBoton="Empezar día" @accion="jornadaStore.empezarJornada" color="success" />
            </div>
        </div>

    </div>
</template>