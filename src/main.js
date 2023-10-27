import { createApp } from 'vue'
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


createApp(App).use(router).use(createPinia()).component('VueDatePicker', VueDatePicker).mount('#app');
