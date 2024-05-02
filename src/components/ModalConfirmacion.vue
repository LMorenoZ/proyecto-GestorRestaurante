<script setup>
    const props = defineProps(['id', 'titulo', 'cuerpo', 'color', 'textoBoton', 'param']);
    const emits = defineEmits(['accion']);
</script>

<!-- Modal que aparece para preguntar al usuario si esta seguro si realizara una accion -->
<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" tabindex="-1" aria-labelledby="modalConfirmar" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-light text-dark ">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="modalConfirmar">{{ titulo }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    {{ cuerpo }}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" :class="`btn btn-${color}`" data-bs-dismiss="modal" @click="$emit('accion', props?.param)" v-if="textoBoton">{{ textoBoton }}</button>
                </div>
            </div>
        </div>
    </div>
</template>