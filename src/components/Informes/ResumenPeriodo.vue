<script setup>
// librerias y metodos de vue
import { onMounted, ref, computed } from 'vue';


import TablaResumen from './TablaResumen.vue';

const props = defineProps(['id', 'rango', 'totales']);

// utilidades
import { USDollar, fechaFormateadaCorta } from '../../utilidades';

// metodos 
const rangoFormateado = computed(() => {
    if (props.rango == null) { return; }

    let rangoConFormato = '';

    let desde = props.rango[0];
    let hasta = props.rango[1];

    if (hasta !== null) {  // en caso de que no se envie el segundo parametro de la fecha
        rangoConFormato = fechaFormateadaCorta(desde) + ' hasta el ' + fechaFormateadaCorta(hasta);
    } else {
        rangoConFormato = 'historial'
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

</script>

<template>
    <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5">Resumen del {{ rangoFormateado }}</h1>
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
                    <button type="button" class="btn btn-primary">Imprimir</button>
                </div>
            </div>
    </div>
</div></template>