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
    import mesaLibre from '../assets/mesas/mesaLibre.svg';
    import mesaDañada from '../assets/mesas/mesaDañada.svg';
    import mesaOcupada from '../assets/mesas/mesaOcupada.svg';
    import mesaDesocupada from '../assets/mesas/mesaDesocupada.svg';
    import mesaNegro from '../assets/mesas/mesaNegro.svg';

   // variables reactivas
   let estadoMesa = props.mesaInfo.estado;
    // metodos
    const cambiarEstado = async () => {
        const mesaModificada = props.mesaInfo;
        mesaModificada.estado = estadoMesa;

        mesasStore.modMesa(mesaModificada);
    }

    const mesaImg = () => {   // cambia la imagen de la mesa segun el estado
        let imagen;
        switch(estadoMesa) {
            case 'libre':
                imagen = mesaLibre;
                break;
            case 'dañada':
                imagen = mesaDañada;
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
            <button class="btn btn-danger" v-if="puedeEliminar"
                @click="mesasStore.borrarMesa(mesaInfo.id)">X</button>
        </div>
        <img 
            :src="mesaImg()" 
            :data-bs-toggle="mesaInfo.estado != 'dañada' ? 'modal' : ''"
            :data-bs-target="`#modal${mesaInfo.id}`"
        >
        <p v-if="mesaInfo.estado !== 'dañada'">{{ mesaInfo.asientos }} asientos</p>
        <p v-else>Mesa dañada</p>
        <button class="btn btn-sm bg-secondary text-light" @click="cambiarEstado">Cambiar estado</button>
        <select class="form-select form-select-sm" v-model="estadoMesa">
            <option disabled value="">Cambiar estado</option>
            <option value="libre">Libre</option>
            <option value="ocupada">Ocupada</option>
            <option value="desocupada">Desocupada</option>
            <option value="dañada">Dañada</option>
        </select>

    </div>

    <!-- Modal para elegir la comida -->
    <ElegirPupusas :modalId="`modal${mesaInfo.id}`" :mesaNum="mesaInfo.mesaNum"></ElegirPupusas>
</template>