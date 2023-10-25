<script setup>
    // librerias
    import { ref, computed } from 'vue';

    // stores
    import { useMesasStore } from '../stores/mesas';
    import { useUserStore } from '../stores/users';
    
    // componentes de interfaz
    import ElegirPupusas from '../components/ElegirPupusas.vue';

    // inicializando stores
    const mesasStore = useMesasStore();
    const userStore = useUserStore();

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
        mesasStore.modMesa(mesa);
        mesaImg(mesa);
    }

    const mesaImg = mesaEstado => {   // cambia la imagen de la mesa segun el estado
        let imagen;
        switch(mesaEstado.estado) {
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

    const puedeEliminar = computed(() => {  // determina si se cumplen las condiciones para que el usuario elimine las mesas
        let res = (userStore.userData?.email === 'admin@test.com') && (props.mesaInfo.estado !== 'ocupada') ;
        return res;
    });
</script>

<template>
    <div class="card m-3" style="width: 18rem;">
        <div class="d-flex justify-content-between">
            <p class="fw-bold">Mesa {{ mesaInfo.mesaNum }}</p>
            <div class="btn btn-danger rounded-pill" v-if="puedeEliminar"
                @click="mesasStore.borrarMesa(mesaInfo.id)">
                <i class="bi bi-x fs-4"></i>
            </div>
        </div>
        <img 
            :src="mesaImg(mesaInfo)" 
            :data-bs-toggle="mesaInfo.estado != 'ocupada' ? 'modal' : ''"
            :data-bs-target="`#modal${mesaInfo.id}`"
        >
        <p>{{ mesaInfo.asientos }} asientos</p>
        <button class="btn btn-sm bg-secondary text-light" @click="cambiarEstado(mesaInfo, estadoMesa)">Cambiar estado</button>
        <select class="form-select form-select-sm" v-model="estadoMesa">
            <option disabled value="">Cambiar estado</option>
            <option value="libre">Libre</option>
            <option value="ocupada">Ocupada</option>
            <option value="desocupada">Desocupada</option>
        </select>

    </div>

    <!-- Modal para elegir la comida -->
    <ElegirPupusas :modalId="`modal${mesaInfo.id}`" :mesaNum="mesaInfo.mesaNum" :mesaInfo="mesaInfo" @cambiarEstado="cambiarEstado"></ElegirPupusas>
</template>