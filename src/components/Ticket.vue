<script setup>
import { computed, ref } from 'vue'

import { useOrdenesStore } from '../stores/ordenes';

// definiendo las props del componente
const props = defineProps(['ordenInfo', 'modalId', 'productos']);

// para imprimir el ticket
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from '../vfs_fonts';
import { USDollar, encontrarProducto } from "../utilidades";

pdfMake.vfs = pdfFonts;

// inicializando stores
const ordenesStore = useOrdenesStore()

// array con los productos disponibles en el local
const productos = props.productos;

// productos de la roden (al menos 1 unidad)
const ordenProductos = props.ordenInfo.productos

// array con los productos de la orden, pero estructurados para ser mostrados en el ticket
const ordenProductosInfo = ref([])

ordenProductos.forEach(prod => {
    const productoInfo = encontrarProducto(productos, prod.idProducto)
    const prodTicket = { ...productoInfo, cantidad: prod.cantidad }
    // printf(prodTicket)
    ordenProductosInfo.value.push(prodTicket)
})
// printf(ordenProductosInfo.value)
const mostrarInfo = computed(() => (ordenProductos.length === ordenProductosInfo.value.length))


const clienteEntrega = ref()   // dinero que el cliente entrega para pagar su orden
const vuelto = ref(0)           // el vuelto a entregar al cliente
const puedeCompletar = ref(false)   // bandera que indica si la orden puede ser completada o falta que el cliente pague

const calcularVuelto = () => {      // calcula el vuelto que hay que entregarle al usuario
    vuelto.value = clienteEntrega.value - props.ordenInfo.total
    puedeCompletar.value = true;
}

const completarOrden = () => {    // funcion que envia la orden del ticket al tab de completadas
    const ordenActualizada = props.ordenInfo;
    ordenActualizada.estado = 'completada';

    ordenesStore.actualizarOrden(ordenActualizada);
}

const cancelarOrden = () => {
    const ordenActualizada = props.ordenInfo;
    ordenActualizada.estado = 'cancelada';

    ordenesStore.actualizarOrden(ordenActualizada);
}

// si la orden esta  pendiente (en preparacion o retrasada)
const ordenPendiente = ref(props.ordenInfo.estado == 'preparacion' || props.ordenInfo.estado == 'tardada')

// funcion que crea el PDF con los datos de la orden (recibo)
const exportPDF = () => {

const buildTableBody = (data, columns) => {
    let body = [];
    body.push([{ text: 'Producto', bold: true }, { text: 'Cantidad', bold: true }, { text: 'Precio unidad', bold: true }]);
    data.forEach(row => {
        let dataRow = [];
        columns.forEach(column => {
            dataRow.push(row[column].toString());
        })
        body.push(dataRow);
    });

    body.push([{ text: 'Total:', bold: true }, '', { text: USDollar.format(props.ordenInfo.total), bold: true }]);
    return body;
}

const table = (data, columns) => {
    return {
        layout: 'lightHorizontalLines', // optional
        table: {
            headerRows: 1,
            widths: ['*', '*', '*'],
            body: buildTableBody(data, columns)
        }
    };
}

const Pdftest = () => {
    // datos de la tabla a imprimir:

    let externalDataRetrievedFromServer = [];

    
    ordenProductosInfo.value.forEach(producto => {
        externalDataRetrievedFromServer.push({Producto: producto.nombre, Cantidad: producto.cantidad, Precio: USDollar.format(producto.precio)})
    })

    let dd = {
        content: [
            { text: `Ticket para la mesa ${props.ordenInfo.mesaNum}`, style: 'header' },
            table(externalDataRetrievedFromServer, ['Producto', 'Cantidad', 'Precio'])
        ],

        styles: {
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
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

    pdfMake.createPdf(dd).print();  // '.open()' para solo abrir el pdf, '.print()' para abrir el pdf y preparalo para imprimir
}

Pdftest();
}
</script>

<template>
    <!-- Modal -->
    <div class="modal fade text-black" :id="`ticketModal${modalId}`" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Ticket órden: {{ ordenInfo.id }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center" v-if="mostrarInfo">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Producto</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Precio unidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(producto, index) in ordenInfo.productos">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ encontrarProducto(productos, producto.idProducto).nombre }}</td>
                                <td>{{ producto.cantidad }}</td>
                                <td>{{ USDollar.format(producto.precio) }}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td class="fw-bold">
                                    <h5>Total:</h5>
                                </td>
                                <td></td>
                                <td class="fw-bold">
                                    <h5>{{ USDollar.format(ordenInfo.total) }}</h5>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <p class="fs-5" v-if="ordenPendiente">
                        <hr>
                        <span>Cobrar</span> <br>
                        <div class="input-group my-2">
                            <label class="input-group-text" :for="`clienteEntregaNum${modalId}`">Cliente entrega ($):</label> <br>
                            <input class="form-control" type="number" :id="`clienteEntregaNum${modalId}`" min="0" step="0.01" v-model="clienteEntrega">
                        </div>
                        <button class="btn btn-success mt-2 " @click="calcularVuelto"
                            :disabled="!clienteEntrega || (ordenInfo.total > clienteEntrega)">Calcular vuelto</button> <br>

                        <div class="mt-4" v-if="puedeCompletar">
                            <span class="fw-bold">Vuelto a entregar:</span> <br>
                            <p>{{ USDollar.format(vuelto) || 'Ingrese cantidad' }}</p>
                        </div>
                        
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="completarOrden"
                          v-if="puedeCompletar">Completar órden</button>
                        
                    </p>
                </div>
                <div v-else>
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                </div>
                <div class="modal-footer justify-content-between" v-if="ordenPendiente">

                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="cancelarOrden">Cancelar
                        orden</button>
                    <div>
                        <button type="button" class="btn btn-warning" @click="exportPDF" v-if="puedeCompletar">Imprimir recibo</button>
                        <button type="button" class="btn btn-secondary m-1" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
                <div v-else>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-secondary m-1" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>