<script setup>
import { RouterLink } from 'vue-router';
import { USDollar } from '../../utilidades';

const props = defineProps(['id', 'nombre', 'foto', 'desc', 'precio', 'tipo'])

</script>

<template>
    <RouterLink :to="`menu/editar/${id}`" class="menu-card-link">
      <div class="menu-card">
        <div class="menu-card__image">
          <div class="menu-card__image-wrapper">
            <img :src="foto" :alt="nombre" class="menu-card__image-item">
          </div>
          <div class="menu-card__icon"><!--
             Aquí puedes colocar el icono correspondiente al tipo de platillo
          
            -->
            <i class="fas fa-utensils"></i>
          </div>
        </div>
        <div class="menu-card__content">
          <h3 class="menu-card__title">{{ nombre }}</h3>
          <p class="menu-card__price">{{ USDollar.format(precio) }}</p>
        </div>
      </div>
    </RouterLink>
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
    background-color: rgba(255, 255, 255, 0.8);
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
