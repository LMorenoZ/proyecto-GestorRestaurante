<script setup>
    const props = defineProps(['titulo', 'texto', 'color']);
</script>

<template>
    <div :class="`alert alert-${color} alert-dismissible fade show m-0`" role="alert">
        <strong>{{ titulo }}</strong> {{ texto }}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" id="cerrarBotonAlerta"></button>
    </div>
</template>