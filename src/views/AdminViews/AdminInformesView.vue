<script setup>
// librerias de vue y afiliados
import { onMounted, ref, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// stores
import { useHistorialStore } from '../../stores/historial';
import { useProductosStore } from '../../stores/productos';

// utilidades
import { encontrarProducto, reducirArray } from '../../utilidades';

// componentes de ui
import ResumenPeriodo from '../../components/Informes/ResumenPeriodo.vue';

// inicializando stores
const historialStore = useHistorialStore();
const productosStore = useProductosStore()


// variables reactivas
const productosVentas = ref();  // se usara para la grafica de los 10 mas vendidos
const listaProductos = ref(productosStore.productos)
const productoSeleccionado = ref()  // Id del producto seleccionado para mostrar las ventas (grafica de linea)

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

    // para los graficos de los 10 producos mas vendidos
    productosVentas.value = arrayProductosReducido
    productosVentas.value = filtrarProductosMasVendidos(productosVentas.value)

    return objetoTotal;
});

/*** Para las gráficas de ventas  ***/
//1) para la grafica de barra de los 10 productos mas vendidos en el periodo

const productosTop10 = ref([])  // productos ya filtrados descendientemente por ventas
const filtrarProductosMasVendidos = async (productosArray) => {
    // printf(productosStore.productos)
    // ordenear descendentemente por las ventas, si hay mas de un producto
    await productosArray.sort((prodA, prodB) => prodB.cantidad - prodA.cantidad) 

    // en caso de haber mas de 10 productos, filtra los primeros 10 solamente
    if (productosArray.length > 10) {
        productosArray = productosArray.slice(0, 10);
    }

    let productosVendidosIdentificados = []
    for (let producto of productosArray) {
        productosVendidosIdentificados.push({...encontrarProducto(productosStore.productos, producto.idProducto), cantidad: producto.cantidad})
    }

    // printf(productosVendidosIdentificados)
    productosTop10.value = productosVendidosIdentificados
    return productosVendidosIdentificados
}

// eje X: los nombres de los productos
const nombreProductos = computed(() => {
    return productosTop10.value.map(producto => producto.nombre)
})
// eje Y: la cantidad de los productos
const productosVentasTop10 = computed(() => {
    return productosTop10.value.map(producto => producto.cantidad)
})

// opciones del grafico de los Top10
const chartOptionsTop10 = computed(() => {
    return {
        chart: {
            id: 'productos-mas-vendidos'
        },
        xaxis: {
            categories: nombreProductos.value
        }
    }
})

const seriesTop10 = computed(() => {
    return [
        {
            name: 'series-1',
            data: productosVentasTop10.value
        },
    ]
})


//2) para la grafica de lineas de las ventas de un producto en el periodo
// Identificar producto con sus ventas
// const productoSeleccionadoInfo = computed(() => {
//     return encontrarProducto(listaProductos.value, productoSeleccionado.value)
// })

// const chartOptionsProducto = computed(() => {
//     return {
//         chart: {
//             id: 'productos-ventas'
//         },
//         xaxis: {
//             categories: [1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004]
//             // categories: nombreProductos.value
//         }
//     }
// })

// const seriesProducto = computed(() => {
//     return [
//         {
//             name: 'series-1',
//             data: [30, 40, 35, 50, 49, 60, 70, 91]
//             // data: productosVentasTop10.value
//         },
//     ]
// })

</script>

<template>
    <h1>Historial de resumenes de días de trabajo</h1>
    
    <!-- Filtrar por fecha -->
    <h4>Elija un rango de fechas para mostrar:</h4>
    <div class="col-sm-10 mb-3 d-flex">
        <VueDatePicker v-model="date" range multi-calendars format="dd/MM/yyyy" />
        <button class="btn btn-info text-white ml-2" @click="filtrar">Filtrar</button>
    </div>

    <div  v-if="historialStore.historialOrdenes.length > 0">
        
        <!-- Imprimir informes de ventas -->
        <div class="d-flex justify-content-center">
            <button type="button" data-bs-toggle="modal" data-bs-target="#resumenPeriodo" class="btn btn-primary">
                Ver informe de ventas del período
            </button>
            <ResumenPeriodo id="resumenPeriodo" :rango="date" :totales="totalResumen" />
        </div>
    
        <hr>
        <!-- Los 10 productos mas vendidos -->
        <div>
            <h3>Los 10 productos más vendidos en el período</h3>
            <div>
                <apexchart width="600" type="bar" :options="chartOptionsTop10" :series="seriesTop10"></apexchart>
            </div>
        </div>

        <hr>
        <!-- Grafico de ventas del producto a lo largo del tiempo -->
        <!-- <div>
            <h3>Ventas del producto</h3>
            {{ productoSeleccionado }}
            <select class="form-select" v-model="productoSeleccionado">
                <option value="" disabled selected>Seleccione un producto</option>
                <option v-for="producto in listaProductos" :key="producto.id" :value="producto.id">{{producto.nombre}}</option>
            </select>

            <apexchart 
                type="line" 
                height="350" 
                :options="chartOptionsProducto" 
                :series="seriesProducto" 
            />
        </div> -->
    </div>
    <div v-else>
        <h3>No existe historial de jornadas para ese período</h3>
    </div>
</template>