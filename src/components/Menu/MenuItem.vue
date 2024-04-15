<script setup>
import { RouterLink } from 'vue-router';
import { USDollar } from '../../utilidades';

const props = defineProps(['id', 'nombre', 'foto', 'desc', 'precio', 'tipo'])

</script>

<template>
    <RouterLink :to="`menu/editar/${id}`">

    <!-- Card provisional para cada elemento del menu -->
    <div class="card m-2" style="width: 18rem;">
        <img :src="foto" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ nombre }}</h5>
            <p class="card-text">{{ desc }}</p>
                <p class="card-text">{{ tipo }}</p>
            <a href="#" class="btn btn-primary">{{ USDollar.format(precio) }}</a>
        </div>
    </div>

    </RouterLink>
</template>