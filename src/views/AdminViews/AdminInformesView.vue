<script setup>
// librerias de vue y afiliados
import { onMounted, ref, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// firebase 
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc, where } from 'firebase/firestore/lite';

// base de datos
import { db } from '../../firebaseConfig';

// stores
import { useHistorialStore } from '../../stores/historial'
import { useMensajesStore } from '../../stores/mensajes';

// utilidades
import { fechaFormateada, nombreUsuario, reducirArray } from '../../utilidades';

// componentes de ui
import JornadaInfo from '../../components/Informes/JornadaInfo.vue';
import ResumenPeriodo from '../../components/Informes/ResumenPeriodo.vue';

// inicializando stores
const historialStore = useHistorialStore();
const mensajesStore = useMensajesStore();

// variables reactivas
const historialOrdenes = ref([]);

// vue datepicker
const date = ref(null);
onMounted(() => {
    const fechaHasta = new Date();
    const fechaDesde = new Date(new Date().setDate(fechaHasta.getDate() - 7));
    date.value = [fechaDesde, fechaHasta];
})


const filtrar = () => {
    if (date.value === null) {
        historialStore.filtrarPorFechas(null);
    } else {
        historialStore.filtrarPorFechas(date.value, date.value[0], date.value[1]);
    }
};

// metodos convencionales
Date.prototype.addDays = function (days) {  // funcion para sumar una cantidad de dias a un valor de tipo Date
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// realiza calculo de todos los productos listados en el historial existentes al momento de hacer click
const totalResumen = computed(() => {
    let objetoTotal = {
        diasTotales: historialStore.historialOrdenes.length,
        completadasTotales: 0,  // ordenes
        canceladasTotales: 0,
        gananciasTotales: 0,  // dinero
        perdidasTotales: 0,
        productos: []  // [{productoId, cantidad}...]
    };

    // array temporal con todos los productos vendidos en el rango de tiempo
    let productosVendidosTemp = [] // [{ idProducto, cantidadVendida }, { ... }], los productos se pueden repetir

    historialStore.historialOrdenes.forEach(jornada => {
        objetoTotal.completadasTotales += jornada.ordenesCompletadas,
            objetoTotal.canceladasTotales += jornada.ordenesCanceladas,
            objetoTotal.gananciasTotales += jornada.gananciasTotales,
            objetoTotal.perdidasTotales += jornada.gananciasPerdidas
            productosVendidosTemp.push(...jornada.productosVendidos)
    });

    
    // reduce el array temporal para que los productos no se repitan y en su lugar se sumen sus iteraciones
    const arrayProductosReducido = reducirArray(productosVendidosTemp)
    objetoTotal.productos = arrayProductosReducido
    
    return objetoTotal;
});


</script>

<template>
    <h1>Historial de resumenes de días de trabajo</h1>

    <!-- Filtrar por fecha -->
    <h4>Elija un rango de fechas para mostrar:</h4>
    <div class="col-sm-10 mb-3 d-flex">
        <VueDatePicker v-model="date" range multi-calendars format="dd/MM/yyyy" />
        <button class="btn btn-info text-white ml-2" @click="filtrar">Filtrar</button>
    </div>

    <div class="d-flex" v-if="historialStore.historialOrdenes.length > 0">
        <!-- Tabs -->
        <ul class="nav nav-tabs flex-column" id="myTab" role="tablist">
            <li class="nav-item" role="presentation" v-for="(jornada, index) of historialStore.historialOrdenes"
                :key="jornada.id">
                <button :class="`nav-link ${index == 0 ? 'active' : ''}`" data-bs-toggle="tab"
                    :data-bs-target="`#tab-pane-${index}`" type="button" aria-selected="true">
                    {{ fechaFormateada(jornada.jornadaFecha) }}
                </button>
            </li>
        </ul>

        <!-- Contenido de las tabs -->
        <div class="tab-content" id="myTabContent">
            <div v-for="(jornada, index) of historialStore.historialOrdenes"
                :class="`tab-pane fade ${index == 0 ? 'show active' : ''}`" role="tabpanel" tabindex="0"
                :id="`tab-pane-${index}`">
                <!-- Componente con la informacion de una jornada en particular -->
                <JornadaInfo :jornada="jornada" />
            </div>
        </div>

        <!-- Para imprimir informes -->
        <div>
            <button type="button" data-bs-toggle="modal" data-bs-target="#resumenPeriodo" class="btn btn-primary">
                Ver resumen del período</button>
            <ResumenPeriodo id="resumenPeriodo" :rango="date" :totales="totalResumen" />
        </div>
    </div>
    <div v-else>
        <h3>No existe historial de jornadas para ese período</h3>
    </div>
</template>