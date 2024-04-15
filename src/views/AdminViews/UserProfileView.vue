<script setup>
    import { useRoute } from 'vue-router';

    const route = useRoute()
</script>

<template>
    <h1>Perfil de {{ $route.params.id }}</h1>

    <div class="container  pt-2">
        <div class="row pt-2 border border-dark">
          <div class="col p-3 mb-2 ">
                <!-- <img src="media/rigby.jpg"> -->
            <h2>Steven Mcain</h2>
            <h4>Director</h4>
          </div>
          <div class="col-8">
            <div class="col">
                <h1>Acerca de:</h1>
                <p class="">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                  Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
                  when an unknown printer took a galley of type and scrambled it to make a type specimen book
                </p>
            </div>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>  
            <div class="text-center">

            </div> 
            <h3>Informacion Adicional</h3>  
            <h4>Nombre: </h4>       
            <h4>Apellido: </h4>
            <h4>Rol: </h4>
            <h4>Direccion:</h4>
            <h4>Email: </h4>
            <h4>Telefono:</h4>
            <h4>DUI:</h4>
            <h4>Fecha de inicio laboral:</h4>
            <br>
            <br>
            <br>
            <button type="button" class="btn btn-outline-primary btn-lg">Cancelar</button> <button class="btn btn-primary btn-lg" type="submit">Guardar</button>
          </div>
        </div>
      </div>
</template>