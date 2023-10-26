<script setup>
// Librerias de vue y afiliados
import { computed, ref } from 'vue';

// stores
import { useBodegaStore } from '../stores/bodega';

// componentes de ui
import ModalConfirmacion from './ModalConfirmacion.vue';

// props del componente
const props = defineProps(['ingrediente']);

// inicializando stores
const bodegaStore = useBodegaStore();

// variables reactivas
const cantidadTotalElemento = ref(props.ingrediente.cantidad);
const cantidadAniadirElemento = ref(0);
const cantidadRestarElemento = ref(0);

// metodos computados
const hayMedida = () => {
    return props.ingrediente.liquido === false ? 'kg' : '';
};

// metodos  
const modificarCantidad = operacion => {
    let ingredienteModificado = {...props.ingrediente};

    if (operacion == 'sumar') {
        ingredienteModificado.cantidad += cantidadAniadirElemento.value;
        cantidadTotalElemento.value += cantidadAniadirElemento.value;
        cantidadAniadirElemento.value = 0;
    } else if (operacion == 'restar') {
        // comprobacion para que el valor resultante no se menor que cero
        let cantidadDisminuida = ingredienteModificado.cantidad -= cantidadRestarElemento.value;
        if (cantidadDisminuida < 0) {
            cantidadDisminuida = 0;
            cantidadTotalElemento.value = 0; // el valor menor de la cantidad siempre sera 0
        } else {
            cantidadTotalElemento.value -= cantidadRestarElemento.value;
            
        }
        ingredienteModificado.cantidad = cantidadDisminuida;
        cantidadRestarElemento.value = 0;
    }

    bodegaStore.modificarIngrediente(ingredienteModificado);
};
</script>

<template>
    <div class="card bg-info mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img :src="ingrediente.imagen" class="img-fluid rounded-start">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">{{ ingrediente.nombre }} - {{ cantidadTotalElemento }} {{ hayMedida() }}</h5>
                    <!-- Aniadir cantidad -->
                    <div class="input-group mb-3">
                        <span class="input-group-text fw-bolder">Añadir</span>
                        <input type="number" class="form-control fw-bold text-success" :placeholder="`Ingresar cantidad ${hayMedida()}`"
                            v-model="cantidadAniadirElemento">
                        <button 
                            class="btn btn-success btn-sm" 
                            data-bs-toggle="modal" :data-bs-target="`#modalSumarCantidad${ingrediente.nombre}`"
                            :disabled="cantidadAniadirElemento <= 0"
                        >Añadir cantidad</button>
                        <ModalConfirmacion
                            :id="`modalSumarCantidad${ingrediente.nombre}`"
                            titulo="Aumentar cantidad"
                            :cuerpo="`¿Está seguro que desea aumentar en ${cantidadAniadirElemento} ${hayMedida()} la cantidad de ${ingrediente.nombre.toLowerCase()}?`"
                            color="primary"
                            @accion="modificarCantidad('sumar')"
                            texto-boton="Añadir"
                        />
                    </div>
                    
                    <!-- Restar cantidad -->
                    <div class="input-group mb-3">
                        <span class="input-group-text fw-bolder">Restar</span>
                        <input type="number" class="form-control fw-bold text-danger" :placeholder="`Ingresar cantidad ${hayMedida()}`"
                            v-model="cantidadRestarElemento">
                        <button 
                            class="btn btn-danger btn-sm" 
                            data-bs-toggle="modal" :data-bs-target="`#modalRestarCantidad${ingrediente.nombre}`"
                            :disabled="cantidadRestarElemento <= 0"
                        >Restar cantidad</button>
                        <ModalConfirmacion
                            :id="`modalRestarCantidad${ingrediente.nombre}`"
                            titulo="Disminuir cantidad"
                            :cuerpo="`¿Está seguro que desea disminuir en ${cantidadRestarElemento} ${hayMedida()} la cantidad de ${ingrediente.nombre.toLowerCase()}?`"
                            color="primary"
                            @accion="modificarCantidad('restar')"
                            texto-boton="Disminuir"
                        />
                    </div>
                    <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
</style>