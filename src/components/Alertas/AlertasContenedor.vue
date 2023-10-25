<script setup>
    import Alerta from './Alerta.vue';

    import { useMensajesStore } from '../../stores/mensajes';

    const mensajesStore = useMensajesStore();
</script>

<template>
    <Alerta 
        v-for="mensaje of mensajesStore.listaMensajes"
        :titulo="mensaje.titulo"
        :texto="mensaje.texto"
        :color="mensaje.color"
     />
</template>