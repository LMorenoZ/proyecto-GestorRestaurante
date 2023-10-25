import { defineStore } from "pinia";

export const useMensajesStore = defineStore('mensajes', {
    state: () => ({
        listaMensajes: []  // {titulo, texto, color (success, warning, etc), id, autoEliminar}
    }),
    actions: {
        crearMensaje(mensaje) {
            this.listaMensajes.push(mensaje);

            if (mensaje.autoEliminar) {
                setTimeout(() => {
                    this.listaMensajes = this.listaMensajes.filter(s => s.id !== mensaje.id);
                }, 10000);
            }
        }, crearError(id, texto) {
            this.crearMensaje({
                titulo: 'Error',
                texto: texto + ', posiblemente por errores del servidor. Revisar consola.',
                id,
                color: 'danger',
                autoEliminar: true
            });
        }
    }
});