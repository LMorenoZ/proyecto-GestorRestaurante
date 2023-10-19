// librerias
import { createRouter, createWebHistory } from 'vue-router';

// stores
import { useUserStore } from './stores/users';

// views 
import Home from './views/HomeView.vue';
import Ordenes from './views/OrdenesView.vue';
import Mesas from './views/MesasView.vue';
import Administracion from './views/AdministracionView.vue'; 


// middlewares para realizar comprobaciones de sesion
const comprobarSesion = async (to, from, next) => {   // simple comprobacion de sesion
    const userStore = useUserStore();
    const user = await userStore.currentUser();
    if (user) {  // la sesion existe, el usuario puede pasar
        next();
    } else { // no hay sesion, el usuaio solo debe ver la pantalla de login
        next('/');
    }
    
};

const existeSesion = async (to, from, next) => {   // para evitar que un usuario quiera entrar en la vista de login
    const userStore = useUserStore();
    const user = await userStore.currentUser();
    if (user) {
        next('/mesas');
    } else {
        next();
    }
}

const sesionAdmin = async (to, from, next) => {   // solo podra entrar el admin
    const userStore = useUserStore();
    const user = await userStore.currentUser();
    if (user.email === 'admin@test.com') {
        next();
    } else {
        next('/mesas');
    }
}

const routes = [
    {
        path: '/',
        component: Home,
        beforeEnter: existeSesion
    },
    {
        path: '/mesas',
        component: Mesas,
        beforeEnter: comprobarSesion
    },
    {
        path: '/ordenes',
        component: Ordenes,
        beforeEnter: comprobarSesion
    },
    {
        path: '/administracion',
        component: Administracion,
        beforeEnter: sesionAdmin
    }
];

const router = createRouter({
    routes,
    linkActiveClass: 'fw-bold',
    history: createWebHistory(import.meta.env.BASE_URL)
});

export default router;