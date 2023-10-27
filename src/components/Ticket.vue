<script setup>
// definiendo las props del componente
const props = defineProps(['ordenInfo', 'modalId', 'totalPagar']);

// para imprimir el ticket
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import pdfMake from 'pdfmake';
pdfMake.addVirtualFileSystem(pdfFonts);
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
        pdfMake.createPdf(dd).open();
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
                    <h1 class="modal-title fs-5">Ticket órden {{ ordenInfo.id }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <ul class="list-group list-group-flush ">
                        <li class="list-group-item" v-if="ordenInfo.queso > 0">
                            <span class="fw-bold">Pupusas de queso:</span> {{ ordenInfo.queso }} x $0.50
                        </li>
                        <li class="list-group-item" v-if="ordenInfo.revueltas > 0">
                            <span class="fw-bold">Pupusas revueltas:</span> {{ ordenInfo.revueltas }} x $0.50
                        </li>
                        <li class="list-group-item" v-if="ordenInfo.chicharron > 0">
                            <span class="fw-bold">Pupusas de chicharron</span> {{ ordenInfo.chicharron }} x $0.50
                        </li>
                        <li class="list-group-item" v-if="ordenInfo.gaseosa > 0">
                            <span class="fw-bold">Gaseosas:</span> {{ ordenInfo.gaseosa }} x $1.00
                        </li>
                        <li class="list-group-item" v-if="ordenInfo.refresco > 0">
                            <span class="fw-bold">Refrescos: </span> {{ ordenInfo.refresco }} x $1.00
                        </li>
                        <li class="list-group-item" v-if="ordenInfo.chocolate > 0">
                            <span class="fw-bold">Chocolate</span> {{ ordenInfo.chocolate }} x $1.00
                        </li>
                    </ul>
                    <hr>
                    <p class="fs-5">
                        <span class="fw-bold">Total:</span> {{ totalPagar }}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" @click="exportPDF">Imprimir</button>
                </div>
            </div>
        </div>
    </div>
</template>