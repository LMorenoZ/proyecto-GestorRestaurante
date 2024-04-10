import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import 'bootstrap-icons/font/bootstrap-icons.css'

createApp(App).use(router).use(createPinia()).component('VueDatePicker', VueDatePicker).mount('#app');
