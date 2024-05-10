<script setup>
// librerias de vue y afiliados
import { onMounted, ref, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// stores
import { useHistorialStore } from '../../stores/historial';
import { useProductosStore } from '../../stores/productos';

// para imprimir el informe
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from '../../vfs_fonts';

// utilidades
import { encontrarProducto, reducirArray, USDollar, fechaFormateadaCorta} from '../../utilidades';

// inicializando stores
const historialStore = useHistorialStore();
const productosStore = useProductosStore()

// pdfmake y vfonts para dar tipografia al documento pdf
pdfMake.vfs = pdfFonts;


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
    // return productosTop10.value.map(producto => producto.cantidad)
    return productosTop10.value.map(producto => producto.cantidad)
})

// opciones del grafico de los Top10
const chartOptionsTop10 = computed(() => {
    return {
        chart: {
            id: 'productos-mas-vendidos',
            // offsetY: 1
        },
        xaxis: {
            categories: nombreProductos.value
        },
        plotOptions: {
            bar: {
                    borderRadius: 5,
            }
        },
        colors: ["#f48024"],
    }
})

const seriesTop10 = computed(() => {
    return [
        {
            name: 'Ventas',
            data: productosVentasTop10.value
        },
    ]
})

///***** Metodos para la generacion de informes  *****/
const rangoFormateado = computed(() => {
    if (date.value == null) { return; }

    let rangoConFormato = '';

    let desde = date.value[0];
    let hasta = date.value[1];

    if (hasta !== null) {  // en caso de que no se envie el segundo parametro de la fecha
        rangoConFormato = 'del período ' + fechaFormateadaCorta(desde) + ' - ' + fechaFormateadaCorta(hasta);
    } else {
        rangoConFormato = 'del día ' + fechaFormateadaCorta(desde);
    }


    return rangoConFormato;
});

// codigo para generar el documento para imprimir
const exportPDFInforme = () => {

const buildTableBody = (data, columns, encabezado, footer) => {
    let body = [];
    body.push(encabezado);
    data.forEach(row => {
        let dataRow = [];
        columns.forEach(column => {
            dataRow.push(row[column].toString());
        })
        body.push(dataRow);
    });
    if (footer) {
        // footer de la tabla
        body.push(footer);
    }
    return body;
}

const table = (data, columns, encabezado, footer = null) => {
    return {
        layout: 'lightHorizontalLines', // optional
        style: 'table',
        table: {
            headerRows: 1,
            widths: ['*', '*'],
            body: buildTableBody(data, columns, encabezado, footer)
        }
    };
}

const Pdftest = () => {
    // datos de la tabla de productos vendidos:
    let externalDataRetrievedFromServer = [];

        totalResumen.value.productos.forEach(prod => {
            const producto = encontrarProducto(productosStore.productos, prod.idProducto)
            externalDataRetrievedFromServer.push({ Producto: producto.nombre, Ventas: prod.cantidad });
        })
        
    let ordenesTabla = [];
        ordenesTabla.push({ Resultado: 'Órdenes completadas', Orden: totalResumen.value.completadasTotales});
        ordenesTabla.push({ Resultado: 'Órdenes canceladas', Orden: totalResumen.value.canceladasTotales});
    // calculo de ordenes totales
    let ordenesTotales = totalResumen.value.completadasTotales + totalResumen.value.canceladasTotales;

    // array de la tabla de dinero
    let tablaDinero = [];
        tablaDinero.push({ Dinero: 'Ganancias', Total: USDollar.format(totalResumen.value.gananciasTotales) });
        tablaDinero.push({ Dinero: 'Pérdidas', Total: USDollar.format(totalResumen.value.perdidasTotales) });
    

    let dd = {
        content: [
            { text: `Informe de ventas y actividades ${rangoFormateado.value}`, style: 'header' },
            // tabla de ventas
            table(externalDataRetrievedFromServer, 
                ['Producto', 'Ventas'], 
                [{ text: 'Producto', bold: true },  { text: 'Cantidad de ventas', bold: true }]
            ),
            // tabla de ordenes
            table(ordenesTabla,  // cuerpo de la tabla
                ['Resultado', 'Orden'],   // columnas de la tabla
                [{ text: 'Tipo de órden', bold: true },  { text: 'Resultado', bold: true }],  // encabezado de la tabla
                [{ text: 'Órdenes totales', bold: true },  { text: ordenesTotales, bold: true }],  // footer de la tabla
            ),
            // tabla de dinero
            table(tablaDinero, 
                ['Dinero', 'Total'],   // encabezado de la tabla
                [{ text: 'Dinero', bold: true },  { text: 'Total', bold: true }],  // encabezado de la tabl
            ),
        ],

        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 5, 0, 10]
            },
            table: {
                margin: [0, 5, 0, 15]
            }
        }
    }

    // fuentes para la tipografia del pdf
    pdfMake.fonts = {
        Roboto: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
            italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    };

    pdfMake.createPdf(dd).open();
}

Pdftest();
}
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
            <button type="button" class="btn btn-primary" @click="exportPDFInforme">Imprimir</button>
        </div>
    
        <hr>
        <!-- Los 10 productos mas vendidos -->
        <div>
            <h3>Los 10 productos más vendidos en el período (unidades)</h3>
            <div>   
                
                <p v-show="false">{{ totalResumen.productos }}</p>
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