<script setup>
// librerias de vue y afiliados
import { onMounted, ref, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// firebase 
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc, where } from 'firebase/firestore/lite';

// base de datos
import { db } from '../../firebaseConfig';

// utilidades
import { fechaFormateada, nombreUsuario } from '../../utilidades';

// componentes de ui
import JornadaInfo from '../../components/Informes/JornadaInfo.vue';
import ResumenPeriodo from '../../components/Informes/ResumenPeriodo.vue';


// variables reactivas
const historialOrdenes = ref([]);

// vue datepicker
const date = ref(null);
onMounted(() => {
    filtrarPorFechas();
    const fechaHasta = new Date();
    const fechaDesde = new Date(new Date().setDate(fechaHasta.getDate() - 7));
    date.value = [fechaDesde, fechaHasta];
})

// metodos de base de datos
const filtrarPorFechas = async () => {

    let q; // query 

    // se establece la query correspondiente al valor de las fechas introducidas
    if (date.value == null || date.value[1] == null) { 
        console.log("Debe ingresar ambas fechas para poder filtrar");
        q = collection(db, 'historialOrdenes'); // consulta por todas las entradas en el historial
    } else {
        const fechaDesde = Timestamp.fromDate(date.value[0]);  // convierte los tipo Date en Timestamp de Firestore
        const fechaHasta = Timestamp.fromDate(date.value[1].addDays(1));

        q = query(collection(db, 'historialOrdenes'),    // la consulta filtrara por las fechas introducidas
            where('jornadaFecha', '>=', fechaDesde),
            where('jornadaFecha', '<=', fechaHasta));
    }

    // se hace la consulta a la base de datos para traer los documentos
    try {
        const querySnapshot = await getDocs(q);

        historialOrdenes.value = []; // limpiar el historial para no aniadir entradas repetidas
        let historialTemp = []; // array temporal

        querySnapshot.forEach(jornada => {
            let objHistorial = {
                id: jornada.id, // se coloca el id
                ...jornada.data(), // todos los demas datos de la jornada
                jornadaFecha: jornada.data().jornadaFecha.toDate()  // se reemplaza el timestamp de firebase por un tipo Date de js
            };
            historialTemp.push(objHistorial);
        });

        // se ordena el historial por fecha, de mas reciente a mas antiguo
        historialOrdenes.value = historialTemp.toSorted((date1, date2) => date2.jornadaFecha - date1.jornadaFecha);
    } catch (error) {
        console.log(error);
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
            quesoTotales: 0,  // pupusas
            revueltasTotales: 0,
            chicharronTotales: 0,
            gaseosaTotales: 0,  // bebidas
            chocolateTotales: 0,
            refrescoTotales: 0,
            completadasTotales: 0,  // ordenes
            canceladasTotales: 0,
            gananciasTotales: 0,  // dinero
            perdidasTotales: 0,
            diasTotales: historialOrdenes.value.length
        }   ;

    historialOrdenes.value.forEach(jornada => {
        objetoTotal.quesoTotales += jornada.quesoTot,
        objetoTotal.revueltasTotales += jornada.revueltasTot,
        objetoTotal.chicharronTotales += jornada.chicharronTot,
        objetoTotal.gaseosaTotales += jornada.gaseosaTot,
        objetoTotal.chocolateTotales += jornada.chocolateTot,
        objetoTotal.refrescoTotales += jornada.refrescoTot,
        objetoTotal.completadasTotales += jornada.ordenesCompletadas,
        objetoTotal.canceladasTotales += jornada.ordenesCanceladas,
        objetoTotal.gananciasTotales += jornada.gananciasTotales,
        objetoTotal.perdidasTotales += jornada.gananciasPerdidas
    });

    return objetoTotal;
});

</script>

<template>
    <h1>Historial de resumenes de días de trabajo</h1>

    <!-- Filtrar por fecha -->
    <h4>Elija un rango de fechas para mostrar:</h4>
    <div class="col-sm-10 mb-3 d-flex">
        <VueDatePicker v-model="date" range multi-calendars format="dd/MM/yyyy" />
        <button class="btn btn-info text-white ml-2" @click="filtrarPorFechas">Filtrar</button>
    </div>

    <div class="d-flex" v-if="historialOrdenes.length > 0">
        <!-- Tabs -->
        <ul class="nav nav-tabs flex-column" id="myTab" role="tablist">
            <li class="nav-item" role="presentation" v-for="(jornada, index) of historialOrdenes" :key="jornada.id">
                <button :class="`nav-link ${index == 0 ? 'active' : ''}`" data-bs-toggle="tab"
                    :data-bs-target="`#tab-pane-${index}`" type="button" aria-selected="true">
                    {{ fechaFormateada(jornada.jornadaFecha) }}
                </button>
            </li>
        </ul>

        <!-- Contenido de las tabs -->
        <div class="tab-content" id="myTabContent">
            <div v-for="(jornada, index) of historialOrdenes" :class="`tab-pane fade ${index == 0 ? 'show active' : ''}`"
                role="tabpanel" tabindex="0" :id="`tab-pane-${index}`">
                <!-- Componente con la infor de una jornada en particular -->
                <JornadaInfo :jornada="jornada" />
            </div>
        </div>

        <!-- Para imprimir informes -->
        <div>
            <button 
                type="button" 
                data-bs-toggle="modal" 
                data-bs-target="#resumenPeriodo" 
                class="btn btn-primary"
            >
            Ver resumen del período</button>
            <ResumenPeriodo 
                id="resumenPeriodo" 
                :rango="date"
                :totales="totalResumen"
            />
        </div>
    </div>
    <div v-else>
        <h3>No existe historial de jornadas para ese período</h3>
    </div>
</template>