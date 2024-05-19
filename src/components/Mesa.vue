<script setup>
// librerias
import { ref, computed } from 'vue';

// componentes de UI
import ModalConfirmacion from './ModalConfirmacion.vue';

// stores
import { useMesasStore } from '../stores/mesas';
import { useUserStore } from '../stores/users';
import { useJornadaStore } from '../stores/jornada';

import { titleElemento } from '../utilidades';

// componentes de interfaz
import CrearOrden from '../components/CrearOrden.vue';

// inicializando stores
const mesasStore = useMesasStore();
const userStore = useUserStore();
const jornadaStore = useJornadaStore()

// definiendo los props del componente
const props = defineProps(['mesaInfo']);
//---------------------------------------------------------   


// imagenes de las mesas que se importan de los assets
import mesaLibre from '../assets/mesas/mesaAzul.svg';
import mesaDesocupada from '../assets/mesas/mesaNaranja.svg';
import mesaOcupada from '../assets/mesas/mesaRoja.svg';
import mesaNegro from '../assets/mesas/mesaNegro.svg';

// variables reactivas
let estadoMesa = ref(props.mesaInfo.estado);

// metodos
const cambiarEstado = async (mesa, estado) => {
    mesa.estado = estado;
    estadoMesa.value = estado;
    mesasStore.modMesa(mesa);
    mesaImg(mesa);
}

const mesaImg = mesaEstado => {   // cambia la imagen de la mesa segun el estado
    let imagen;
    switch (mesaEstado.estado) {
        case 'libre':
            imagen = mesaLibre;
            break;
        case 'desocupada':
            imagen = mesaDesocupada;
            break;
        case 'ocupada':
            imagen = mesaOcupada;
            break;
        default:
            imagen = mesaNegro;
            break;
    }
    return imagen;
};

const cambiarColorEstado = () => {
    let color = "";
    if (estadoMesa.value == 'libre') { color = 'text-primary fw-bolder';} 
    else if (estadoMesa.value == 'ocupada') { color = 'text-danger fw-bolder';} 
    else if (estadoMesa.value == 'desocupada') { color = 'text-warning fw-bolder';} 
    return color;
};

// metodos computados 
const colorEstado = computed(() => {  // cambia el color del estado de cada mesa
    return cambiarColorEstado();
});
</script>

<template>
    <div class="card m-3 p-3" style="width: 18rem;">
        <div class="d-flex justify-content-between bg-primary-subtle">
            <p class="fw-bold bg-primary rounded-circle text-white py-2 px-3">{{ mesaInfo.mesaNum }}</p>
            <div :title="titleElemento('No puede eliminar la mesa con la jornada activa', jornadaStore.jornadaActiva)">
                <button type="button" class="btn" style="border: none;" data-bs-toggle="modal" :data-bs-target="`#borrarMesa${mesaInfo.id}`" v-if="userStore.userRol === 'admin'" :disabled="jornadaStore.jornadaActiva">
                    <i class="bi bi-x fs-3 bg-danger rounded-circle px-1 text-light"></i>
                </button>
            </div>
        </div>
        <div class="card-body bg-primary-subtle">
            <img :src="mesaImg(mesaInfo)" :data-bs-toggle="mesaInfo.estado != 'ocupada' ? 'modal' : ''"
                :data-bs-target="`#modal${mesaInfo.id}`" class="img-fluid">
        </div>
        <div class="card-footer text-center bg-success-subtle">
            <small class=" text-muted fw-bold">{{ mesaInfo.asientos }} asientos</small> <br>
            <small class="fw-bold">Estado:</small>
        </div>
        <select class="form-select form-select-sm text-center bg-danger-subtle" :class="colorEstado" @change="cambiarEstado(mesaInfo, estadoMesa)" v-model="estadoMesa" :id="`mesa${mesaInfo.id}`">
            <option disabled value="">Cambiar estado</option>
            <option value="libre">Libre</option>
            <option value="ocupada">Ocupada</option>
            <option value="desocupada">Desocupada</option>
        </select>
    </div>

    <!-- Modal para elegir la comida -->
    <CrearOrden :modalId="`modal${mesaInfo.id}`" :mesaNum="mesaInfo.mesaNum" :mesaInfo="mesaInfo"
        @cambiarEstado="cambiarEstado">
    </CrearOrden>


    <ModalConfirmacion 
        :id="`borrarMesa${mesaInfo.id}`"
        :titulo="`Borrar mesa ${mesaInfo.mesaNum}`"
        :cuerpo="`Confirme si desea realmente eliminar la mesa numero ${mesaInfo.mesaNum}`"
        color="danger"
        textoBoton="Borrar mesa"
        :param="mesaInfo.id"
        @accion="mesasStore.borrarMesa"
    />
</template>

<style>
    option {
        color: black;
    }
</style>