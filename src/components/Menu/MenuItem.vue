<script setup>
import { RouterLink } from 'vue-router';
import { USDollar } from '../../utilidades';

import { useProductosStore } from '../../stores/productos';
import { useMensajesStore } from '../../stores/mensajes';
import { useJornadaStore } from '../../stores/jornada';
import { storage } from '../../firebaseConfig';

import { deleteObject, ref as firebaseRef } from 'firebase/storage';

import ModalConfirmacion from '../ModalConfirmacion.vue';

const productosStore = useProductosStore()
const mensajestore = useMensajesStore()
const jornadaStore = useJornadaStore()

const props = defineProps(['id', 'nombre', 'foto', 'desc', 'precio', 'tipo'])

const borrarProducto = async (productoBorrar) => {
  try {
    // Borrar la foto de storage
    const refFotoProducto = firebaseRef(storage, productoBorrar.foto)

    // se elimina la foto existente
    await deleteObject(refFotoProducto)

    // borrar el producto de la coleccion de firestore
    await productosStore.eliminarProducto(productoBorrar.id)

    mensajestore.crearMensaje({
      titulo: 'Producto eliminado',
      texto: 'El producto ha sido eliminado exitosamente',
      color: 'success',
      id: 'ProductoBorrardoExito',
      autoEliminar: true
    })
  } catch (error) {
    mensajestore.crearError('NoProductoBorrado', 'No se pudo borrar el producto')
    console.log(error)
  }
}

</script>

<template>
    
      <div class="menu-card">
        <div class="menu-card__image">

          <RouterLink :to="`menu/editar/${id}`" class="menu-card-link" v-if="!jornadaStore.jornadaActiva">
            <div class="menu-card__image-wrapper">
              <img :src="foto" :alt="nombre" class="menu-card__image-item">
            </div>
          </RouterLink>
          <div class="menu-card__image-wrapper" v-else>
            <img :src="foto" :alt="nombre" class="menu-card__image-item">
          </div>

          <div class="menu-card__icon bg-danger" title="Borrar" data-bs-toggle="modal" :data-bs-target="`#borrarProductoModal${id}`" v-if="!jornadaStore.jornadaActiva">
            <span class="badge btn text-bg-danger"><i class="bi bi-trash"></i></span>
          </div>
        </div> 
        <div class="menu-card__content">
          <h3 class="menu-card__title">{{ nombre }}</h3>
          <p class="menu-card__price">{{ USDollar.format(precio) }}</p>
          <div class="d-flex justify-content-end">
            <RouterLink :to="`menu/editar/${id}`" class="menu-card-link" title="Editar" v-if="!jornadaStore.jornadaActiva">
              <div class="btn btn-success btn-sm ">
                <i class="bi bi-pencil"></i>  
              </div >
            </RouterLink>
          </div>
        </div>
      </div>

      <ModalConfirmacion 
        :id="`borrarProductoModal${id}`"
        titulo="Borrar producto"
        :cuerpo="`Está seguro que desea borrar el producto ${nombre} ¡Esta acción no se puede deshacer!`"
        color="danger"
        textoBoton="Borrar producto"
        :param="{id, foto}"
        @accion="borrarProducto"
      />
  </template>
  

  <style scoped>
  .menu-card-link {
    text-decoration: none;
    color: inherit;
  }
  
  .menu-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 250px;
    margin: 16px;
    overflow: hidden;
    transition: transform 0.3s ease-in-out;
  }
  
  .menu-card:hover {
    transform: translateY(-4px);
  }
  
  .menu-card__image {
    position: relative;
    height: 180px;
    overflow: hidden;
  }
  
  .menu-card__image-wrapper {
    overflow: hidden;
    border-radius: 12px 12px 0 0;
  }
  
  .menu-card__image-item {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
  
  .menu-card__image-wrapper:hover .menu-card__image-item {
    transform: scale(1.1);
  }
  
  .menu-card__icon {
    position: absolute;
    top: 12px;
    right: 12px;
    /* background-color: rgba(211, 36, 36, 0.8); */
    /* background-image: url(''); */
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #333;
  }
  
  .menu-card__content {
    padding: 16px;
  }
  
  .menu-card__title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
  }
  
  .menu-card__price {
    font-size: 16px;
    color: #666;
  }
  </style>
