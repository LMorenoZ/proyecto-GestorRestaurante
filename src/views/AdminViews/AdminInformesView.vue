<script setup>
// librerias de vue y afiliados
import { ref } from 'vue';

// firebase 
import { Timestamp, query, collection, doc, getDocs, addDoc, orderBy, deleteDoc, getDoc, updateDoc, setDoc } from 'firebase/firestore/lite';

// base de datos
import { db } from '../../firebaseConfig';

// utilidades
import { fechaFormateada, nombreUsuario } from '../../utilidades';

// componentes de ui
import JornadaInfo from '../../components/JornadaInfo.vue';


// variables reactivas
const historialOrdenes = ref([]);


// metodos de base de datos
(async () => {
    let historialTemp = [];
    const querySnapshot = await getDocs(collection(db, 'historialOrdenes'));  // trae la info, potencialmente desordenada
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
})();


</script>

<template>
    <h1>Informes</h1>

    <h2>Historial de resumenes de días de trabajo</h2>
    <!-- Filtrar por fecha -->


    <div class="d-flex">
        <!-- Tabs -->
        <ul class="nav nav-tabs flex-column" id="myTab" role="tablist">
            <li 
                class="nav-item" 
                role="presentation" 
                v-for="(jornada, index) of historialOrdenes" 
                :key="jornada.id"
            >
                <button 
                    :class="`nav-link ${index == 0 ? 'active' : ''}`" 
                    data-bs-toggle="tab" 
                    :data-bs-target="`#tab-pane-${index}`" 
                    type="button"
                    aria-selected="true"
                >
                    {{ fechaFormateada(jornada.jornadaFecha) }}
                </button>
            </li>
        </ul>

        <!-- Contenido de las tabs -->
        <div class="tab-content" id="myTabContent">
            <div 
                v-for="(jornada, index) of historialOrdenes" 
                :class="`tab-pane fade ${index == 0 ? 'show active' : ''}`" 
                role="tabpanel" 
                tabindex="0" 
                :id="`tab-pane-${index}`"
            >
                <!-- Componente con la infor de una jornada en particular -->
                <JornadaInfo :jornada="jornada" />
            </div>
        </div>
    </div>
</template>