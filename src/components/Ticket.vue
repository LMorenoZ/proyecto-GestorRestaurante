<script setup>
// definiendo las props del componente
const props = defineProps(['ordenInfo', 'modalId', 'productos']);

// para imprimir el ticket
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from '../vfs_fonts';
import { USDollar, encontrarProducto } from "../utilidades";
pdfMake.vfs = pdfFonts;

const exportPDF = () => {

    const buildTableBody = (data, columns) => {
        let body = [];
        body.push([{ text: 'Producto', bold: true }, { text: 'Precio', bold: true }, { text: 'Cantidad', bold: true }]);
        data.forEach(row => {
            let dataRow = [];
            columns.forEach(column => {
                dataRow.push(row[column].toString());
            })
            body.push(dataRow);
        });

        body.push([{ text: 'Total:', bold: true }, '', { text: props.totalPagar, bold: true }]);
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

        if (props.ordenInfo.queso > 0)
            externalDataRetrievedFromServer.push({ Producto: 'Pupusas de queso', Precio: '$0.50', Cantidad: props.ordenInfo.queso });
        if (props.ordenInfo.revueltas > 0)
            externalDataRetrievedFromServer.push({ Producto: 'Pupusas revueltas', Precio: '$0.50', Cantidad: props.ordenInfo.revueltas });
        if (props.ordenInfo.chicharron > 0)
            externalDataRetrievedFromServer.push({ Producto: 'Pupusas de chicharrón', Precio: '$0.50', Cantidad: props.ordenInfo.chicharron });
        if (props.ordenInfo.gaseosa > 0)
            externalDataRetrievedFromServer.push({ Producto: 'Bebidas gaseosas', Precio: '$1.00', Cantidad: props.ordenInfo.gaseosa });
        if (props.ordenInfo.refresco > 0)
            externalDataRetrievedFromServer.push({ Producto: 'Refrescos', Precio: '$1.00', Cantidad: props.ordenInfo.refresco });
        if (props.ordenInfo.chocolate > 0)
            externalDataRetrievedFromServer.push({ Producto: 'Chocolate caliente', Precio: '$1.00', Cantidad: props.ordenInfo.chocolate });

        let dd = {
            content: [
                { text: `Ticket para la mesa ${props.ordenInfo.mesaNum}`, style: 'header' },
                table(externalDataRetrievedFromServer, ['Producto', 'Precio', 'Cantidad'])
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

        pdfMake.createPdf(dd).open();
    }

    Pdftest();
}


const productos = props.productos;
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
                <div class="modal-body text-center">
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
                    <hr>
                    <p class="fs-5">
                        <span class="fw-bold">Cobrar</span>  <br>
                        <span>Cliente entrega:</span> <br> 
                        <input class="form-control" type="number">
                        <span>Vuelto:</span> <br> 
                        <input class="form-control" type="number">
                        <button class="btn btn-success mt-2">Calcular</button> <br>
                        <button class="btn btn-primary mt-2">Completar órden</button>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-warning" @click="exportPDF">Imprimir recibo</button>
                </div>
            </div>
        </div>
    </div>
</template>