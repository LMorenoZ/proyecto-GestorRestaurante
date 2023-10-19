<script setup>
    // definiendo las props del componente
    const props = defineProps(['ordenInfo', 'modalId', 'totalPagar']);
</script>

<template>
    <!-- Modal -->
    <div class="modal fade text-black" :id="`ticketModal${modalId}`" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5">Ticket órden {{ ordenInfo.id }}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <ul class="list-group list-group-flush ">
                    <li class="list-group-item" v-if="ordenInfo.queso > 0">
                        <span class="fw-bold">Pupusas de queso:</span> {{ ordenInfo.queso }} x $0.50 
                    </li> 
                    <li class="list-group-item" v-if="ordenInfo.revueltas > 0">
                        <span class="fw-bold">Pupusas revueltas:</span> {{ ordenInfo.revueltas }} x $0.50 
                    </li> 
                    <li class="list-group-item" v-if="ordenInfo.chicharron > 0">
                        <span class="fw-bold">Pupusas de chicharron</span> {{ ordenInfo.chicharron }} x $0.50 
                    </li> 
                    <li class="list-group-item" v-if="ordenInfo.gaseosa > 0">
                        <span class="fw-bold">Gaseosas:</span> {{ ordenInfo.gaseosa }} x $1.00 
                    </li> 
                    <li class="list-group-item" v-if="ordenInfo.refresco > 0">
                        <span class="fw-bold">Refrescos: </span> {{ ordenInfo.refresco }} x $1.00
                    </li> 
                    <li class="list-group-item" v-if="ordenInfo.chocolate > 0">
                        <span class="fw-bold">Chocolate</span> {{ ordenInfo.chocolate }} x $1.00
                    </li> 
                </ul>
                <hr>
                <p class="fs-5">
                    <span class="fw-bold">Total:</span> {{ totalPagar }}
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
            </div>
        </div>
    </div>
</template>