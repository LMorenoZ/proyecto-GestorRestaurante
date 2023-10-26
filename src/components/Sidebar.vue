<template>
    <div class="d-flex flex-column flex-shrink-0 p-3 bg-light" style="width: 280px;">
       
            <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
            <span class="fs-4">Administración del local</span>
        
        <hr>
        <ul class="nav nav-pills flex-column mb-auto row">
            <li class="nav-item">
                <router-link  class="nav-link link-dark" aria-current="page" to="empleados">
                    <svg class="bi me-2" width="16" height="16"><use xlink:href="#home"></use></svg>
                    Empleados
                </router-link>
            </li>
            <li class="">
                <router-link  class="nav-link link-dark" to="informes">
                    <svg class="bi me-2" width="16" height="16"><use xlink:href="#informes"></use></svg>
                    Informes
                </router-link>
                <router-link  class="nav-link link-dark" to="bodega">
                    <svg class="bi me-2" width="16" height="16"><use xlink:href="#bodega"></use></svg>
                    Bodega
                </router-link>
            </li>
        </ul>
  </div>
</template>