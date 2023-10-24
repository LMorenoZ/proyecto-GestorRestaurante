<script setup>
import { computed } from 'vue';

const props = defineProps(['encabezado1', 'encabezado2', 'lista', 'color', 'total']);

// metodos computados

const pupusasTotalesVendidas = computed(() => {
    let total = 0;
    props.lista.forEach(tipoPupusa => total += tipoPupusa.valor);
    return total;
});
</script>

<template>
    <table :class="`table table-${color} text-center`">
        <thead>
            <tr>
                <th scope="col">
                    <p class="fs-5">{{ encabezado1 }}</p>
                </th>
                <th scope="col">
                    <p class="fs-5">{{ encabezado2 }}</p>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(campo, index) of lista" :key="index">
                <th>{{ campo.nombre }}</th>
                <td>{{ campo.valor }}</td>
            </tr>
        </tbody>
        <tfoot v-if="total">
            <tr>
                <th>Total</th>
                <td class="fw-bold"> {{ pupusasTotalesVendidas }}</td>  
            </tr>
        </tfoot>    
    </table>
</template>