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
                <tr class="table-danger">
                    <th>Fecha</th>
                    <td>{{ fechaFormateadaCorta(jornada.jornadaFecha) }}</td>
                </tr>
                <tr class="table-info   ">
                    <th>Pupusas de queso</th>
                    <td>{{ jornada.quesoTot }}</td>
                </tr>
                <tr class="table-info">
                    <th>Pupusas revueltas</th>
                    <td>{{ jornada.revueltasTot }}</td>
                </tr>
                <tr class="table-info">
                    <th>Pupusas de chicharrón</th>
                    <td>{{ jornada.chicharronTot }}</td>
                </tr>
                <tr class="table-info">
                    <th>Total pupusas vendidas</th>
                    <td class="fw-bold">{{ pupusasVendidas }}</td>
                </tr>
                <tr class="table-warning">
                    <th>Gaseosas</th>
                    <td>{{ jornada.gaseosaTot }}</td>
                </tr>
                <tr class="table-warning">
                    <th>Refrescos</th>
                    <td>{{ jornada.refrescoTot }}</td>
                </tr>
                <tr class="table-warning">
                    <th>Chocolates</th>
                    <td>{{ jornada.chocolateTot }}</td>
                </tr>
                <tr class="table-warning">
                    <th>Total bebidas vendidas</th>
                    <td class="fw-bold"> {{ bebidasVendidas }}</td>
                </tr>
                <tr class="table-primary">
                    <th>Órdenes completadas</th>
                    <td>{{ jornada.ordenesCompletadas }}</td>
                </tr>
                <tr class="table-primary">
                    <th>Órdenes canceladas</th>
                    <td>{{ jornada.ordenesCanceladas }}</td>
                </tr>
                <tr class="table-success">
                    <th>Ganancias totales</th>
                    <td class="fw-bold text-success">{{ USDollar.format(jornada.gananciasTotales) }}</td>
                </tr>
                <tr class="table-success">
                    <th>Ganancias perdidas</th>
                    <td class="text-danger">{{ USDollar.format(jornada.gananciasPerdidas) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>