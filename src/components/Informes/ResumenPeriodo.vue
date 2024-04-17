<script setup>
// librerias y metodos de vue
import { onMounted, ref, computed } from 'vue';

// store de pinia
import { useProductosStore } from '../../stores/productos'

// para imprimir el informe
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from '../../vfs_fonts';

// componentes de ui
import TablaResumen from './TablaResumen.vue';

// funciones de utilidades 
import { USDollar, encontrarProducto, fechaFormateadaCorta } from '../../utilidades';

// props del componente
const props = defineProps(['id', 'rango', 'totales']);

// inicializando stores
const productosStore = useProductosStore()

// pdfmake y vfonts para dar tipografia al documento pdf
pdfMake.vfs = pdfFonts;


// metodos 
const rangoFormateado = computed(() => {
    if (props.rango == null) { return; }

    let rangoConFormato = '';

    let desde = props.rango[0];
    let hasta = props.rango[1];

    if (hasta !== null) {  // en caso de que no se envie el segundo parametro de la fecha
        rangoConFormato = 'del período ' + fechaFormateadaCorta(desde) + ' - ' + fechaFormateadaCorta(hasta);
    } else {
        rangoConFormato = 'del día ' + fechaFormateadaCorta(desde);
    }


    return rangoConFormato;
});

// objetos para las tablas
const objPupusas = computed(() => {
    let arrayObj = [
        { nombre: 'Queso', valor: props?.totales.quesoTotales },
        { nombre: 'Revueltas', valor: props?.totales.revueltasTotales },
        { nombre: 'Chicharron', valor: props?.totales.chicharronTotales }
    ]
    return arrayObj;
});

const objBebidas = computed(() => {
    let arrayObj = [
        { nombre: 'Refrescos', valor: props?.totales.refrescoTotales },
        { nombre: 'Gaseosas', valor: props?.totales.gaseosaTotales },
        { nombre: 'Chocolates', valor: props?.totales.chocolateTotales }
    ]

    return arrayObj;
});

const objOrdenes = computed(() => {
    let arrayObj = [
        { nombre: 'Finalizadas', valor: props?.totales.completadasTotales },
        { nombre: 'Canceladas', valor: props?.totales.canceladasTotales }
    ]

    return arrayObj;
});

const objDinero = computed(() => {
    let arrayObj = [
        { nombre: 'Ganancias', valor: USDollar.format(props.totales.gananciasTotales) },
        { nombre: 'Pérdidas', valor: USDollar.format(props.totales.perdidasTotales) }
    ]

    return arrayObj;
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

        props?.totales.productos.forEach(prod => {
            const producto = encontrarProducto(productosStore.productos, prod.idProducto)
            externalDataRetrievedFromServer.push({ Producto: producto.nombre, Ventas: prod.cantidad });
        })

    let ordenesTabla = [];
        ordenesTabla.push({ Resultado: 'Órdenes completadas', Orden: props?.totales.completadasTotales});
        ordenesTabla.push({ Resultado: 'Órdenes canceladas', Orden: props?.totales.canceladasTotales});
    // calculo de ordenes totales
    let ordenesTotales = props?.totales.completadasTotales + props?.totales.canceladasTotales;

    // array de la tabla de dinero
    let tablaDinero = [];
        tablaDinero.push({ Dinero: 'Ganancias', Total: USDollar.format(props.totales.gananciasTotales) });
        tablaDinero.push({ Dinero: 'Pérdidas', Total: USDollar.format(props.totales.perdidasTotales) });
    

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
    <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Resumen {{ rangoFormateado }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-3">

                    <div class="container-fluid">
                        <p class="fs-5"> <span class="fw-bold">Jornadas en el período:</span> {{ totales.diasTotales }}</p>
                        <div class="row">
                            <div class="col">
                                <TablaResumen encabezado1="Pupusas" encabezado2="Cantidad vendidas" color="warning"
                                    :lista="objPupusas" :total="true" />
                            </div>
                            <div class="col">
                                <TablaResumen encabezado1="Bebidas" encabezado2="Cantidad vendidas" color="danger"
                                    :lista="objBebidas" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <TablaResumen encabezado1="Órdenes" encabezado2="Realizadas" color="dark"
                                    :lista="objOrdenes" />
                            </div>
                            <div class="col">
                                <TablaResumen encabezado1="Dinero" encabezado2="Calculado" color="success"
                                    :lista="objDinero" />
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" @click="exportPDFInforme">Imprimir</button>
                </div>
            </div>
    </div>
</div>
</template>