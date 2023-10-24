<script setup>
    // utilidades
    import { fechaFormateada, fechaFormateadaCorta, USDollar } from '../utilidades';

    const props = defineProps(['jornada']);
</script>

<template>
    <table class="table">
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Campo</th>
            <th scope="col">Valor</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
                <th>Fecha</th>
                <td>{{ fechaFormateadaCorta(jornada.jornadaFecha) }}</td>
            </tr>
        <tr>
            <th scope="row">2</th>
            <th>Órdenes totales</th>
            <td>{{ jornada.ordenesCompletadas }}</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <th>Órdenes canceladas</th>
            <td>{{ jornada.ordenesCanceladas }}</td>
        </tr>
        <tr>
            <th scope="row">4</th>
            <th>Ganancias totales</th>
            <td>{{ USDollar.format(jornada.gananciasTotales) }}</td>
        </tr>
        <tr>
            <th scope="row">5</th>
            <th>Ganancias perdidas</th>
            <td>{{ USDollar.format(jornada.gananciasPerdidas) }}</td>
        </tr>
        <tr>
            <th scope="row">6</th>
            <th>Pupusas de queso</th>
            <td>{{ jornada.quesoTot }}</td>
        </tr>
        <tr>
            <th scope="row">7</th>
            <th>Pupusas revueltas</th>
            <td>{{ jornada.revueltasTot }}</td>
        </tr>
        <tr>
            <th scope="row">8</th>
            <th>Pupusas de chicharrón</th>
            <td>{{ jornada.chicharronTot }}</td>
        </tr>
        <tr>
            <th scope="row">8</th>
            <th>Gaseosas</th>
            <td>{{ jornada.gaseosaTot }}</td>
        </tr>
        <tr>
            <th scope="row">8</th>
            <th>Refrescos</th>
            <td>{{ jornada.refrescoTot }}</td>
        </tr>
        <tr>
            <th scope="row">8</th>
            <th>Chocolates</th>
            <td>{{ jornada.chocolateTot }}</td>
        </tr>
    </tbody>
    </table>
</template>