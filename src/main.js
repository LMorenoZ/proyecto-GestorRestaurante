import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import VueApexCharts from "vue3-apexcharts";
import '@vuepic/vue-datepicker/dist/main.css';

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "bootstrap"

import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(router).use(createPinia()).use(VueApexCharts).component('VueDatePicker', VueDatePicker).mount('#app');
