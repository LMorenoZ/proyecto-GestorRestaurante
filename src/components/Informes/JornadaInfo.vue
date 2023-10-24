<script setup>
// librerias de vue y afiliados
import { computed, ref } from 'vue';

// utilidades
import { fechaFormateada, fechaFormateadaCorta, USDollar } from '../../utilidades';

const props = defineProps(['jornada']);

// metodos para calculos

const pupusasVendidas = computed(() => {
    let pupusasTotales = 0;

    pupusasTotales += props.jornada.quesoTot;
    pupusasTotales += props.jornada.revueltasTot;
    pupusasTotales += props.jornada.chicharronTot;

    return pupusasTotales;
});

const bebidasVendidas = computed(() => {
    let bebidasTotales = 0;

    bebidasTotales += props.jornada.chocolateTot;
    bebidasTotales += props.jornada.gaseosaTot;
    bebidasTotales += props.jornada.refrescoTot;

    return bebidasTotales;
});
</script>

<template>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Campo</th>
                    <th scope="col">Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th>Fecha</th>
                    <td>{{ fechaFormateadaCorta(jornada.jornadaFecha) }}</td>
                </tr>
                <tr>
                    <th>Órdenes totales</th>
                    <td>{{ jornada.ordenesCompletadas }}</td>
                </tr>
                <tr>
                    <th>Órdenes canceladas</th>
                    <td>{{ jornada.ordenesCanceladas }}</td>
                </tr>
                <tr>
                    <th>Ganancias totales</th>
                    <td>{{ USDollar.format(jornada.gananciasTotales) }}</td>
                </tr>
                <tr>
                    <th>Ganancias perdidas</th>
                    <td>{{ USDollar.format(jornada.gananciasPerdidas) }}</td>
                </tr>
                <tr>
                    <th>Pupusas de queso</th>
                    <td>{{ jornada.quesoTot }}</td>
                </tr>
                <tr>
                    <th>Pupusas revueltas</th>
                    <td>{{ jornada.revueltasTot }}</td>
                </tr>
                <tr>
                    <th>Pupusas de chicharrón</th>
                    <td>{{ jornada.chicharronTot }}</td>
                </tr>
                <tr>
                    <th>Total pupusas vendidas</th>
                    <td>{{ pupusasVendidas }}</td>
                </tr>
                <tr>
                    <th>Gaseosas</th>
                    <td>{{ jornada.gaseosaTot }}</td>
                </tr>
                <tr>
                    <th>Refrescos</th>
                    <td>{{ jornada.refrescoTot }}</td>
                </tr>
                <tr>
                    <th>Chocolates</th>
                    <td>{{ jornada.chocolateTot }}</td>
                </tr>
                <tr>
                    <th>Total bebidas vendidas</th>
                    <td> {{ bebidasVendidas }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>