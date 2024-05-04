<!-- Javascript del componente -->
<script setup>

</script>


<!-- HTML del componente -->
<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 fondo" style="height:auto;">
       
            <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
            <span class="fs-5 text-black text-center">Administración</span>
        
        <hr>
        <ul class="nav nav-pills flex-column mb-auto row">
            <li class="nav-item  text-center">

                <router-link  class="btn btn-dark text-white" aria-current="page" to="/administracion/empleados">
                    Empleados
                </router-link>
            </li>
            <li class="nav-item  text-center mt-4">
                <router-link  class="btn btn-dark text-white" to="/administracion/informes">
                    Informes
                </router-link>
            </li>
        </ul>
  </div> 
</template>

<!-- CSS del componente -->
<style scoped>
.fondo{
background-color:#F3E75C ;
}
</style>