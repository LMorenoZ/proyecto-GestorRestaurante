// librerias
import { createRouter, createWebHistory } from 'vue-router';

// stores
import { useUserStore } from './stores/users';

// views
import Home from './views/HomeView.vue';
import Ordenes from './views/OrdenesView.vue';
import Mesas from './views/MesasView.vue';
import Administracion from './views/AdministracionView.vue';
import AdminEmpleados from './views/AdminViews/AdminEmpleadosView.vue';
import AdminInformes from './views/AdminViews/AdminInformesView.vue';
import AdminBodega from './views/AdminViews/AdminBodegaView.vue';
import ProductoCrearView from './views/Menu/ProductoCrearView.vue';
import ProductoInfoView from './views/Menu/EditarProductoView.vue';
import Menu from './views/Menu/MenuView.vue';
import UserProfileView from './views/AdminViews/UserProfileView.vue';
import CrearUsuarioView from './views/AdminViews/CrearUsuarioView.vue';
import NotFound from './views/404NotFoundView.vue'

// middlewares para realizar comprobaciones de sesion
// simple comprobacion de sesion
const comprobarSesion = async (to, from, next) => {   
    const userStore = useUserStore();
    const user = await userStore.currentUser();
    if (user) {  // la sesion existe, el usuario puede pasar
        next();
    } else { // no hay sesion, el usuaio solo debe ver la pantalla de login
        next('/');
    }
    
};

// para evitar que un usuario quiera entrar en la vista de login
const existeSesion = async (to, from, next) => {   
    const userStore = useUserStore();
    const user = await userStore.currentUser();

    if (user) {
        if(userStore.userRol === 'Mesero') { 
            next('/mesas');
        } else if (userStore.userRol === 'Cocina' || userStore.userRol === 'Caja') {
            next('/ordenes')
        } else if (userStore.userRol === 'admin') {
            next('/administracion')
        }
    } else {
        next();
    }
}

// solo podra entrar el admin
const sesionAdmin = async (to, from, next) => {   
    const userStore = useUserStore();
    await userStore.currentUser();
    if (userStore.userRol === 'admin') {
        next();
    } else {
        next('/');
    }
}


const routes = [
    {
        path: '/',
        components: {
            default: Home,
        },
        beforeEnter: existeSesion
    },
    {
        path: '/mesas',
        component: Mesas,
        beforeEnter: comprobarSesion
    },
    {
        path: '/menu',
        component: Menu,
        beforeEnter: comprobarSesion
    },
    {
        path: '/menu/nuevo',
        component: ProductoCrearView,
        beforeEnter: sesionAdmin
    },
    {
        path: '/menu/editar/:id',
        component: ProductoInfoView,
        beforeEnter: sesionAdmin
    },
    {
        path: '/ordenes',
        component: Ordenes,
        beforeEnter: comprobarSesion
    },
    {
        path: '/administracion/',
        redirect: { path: "/administracion/empleados" },
        components: {
            default: Administracion
        },
        children: [
            { path: 'empleados', 
                components: {seccionAdmin: AdminEmpleados}
            },
            { path: 'informes', 
                components: {seccionAdmin: AdminInformes}
            },
            { path: 'bodega', 
                components: {seccionAdmin: AdminBodega}
            },
            { path: 'crear_usuario', 
                components: {seccionAdmin: CrearUsuarioView}
            },
            { path: 'perfil/:id', 
                components: {seccionAdmin: UserProfileView}
            }
        ],
        beforeEnter: sesionAdmin
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: NotFound,
        beforeEnter: comprobarSesion
    },
];

const router = createRouter({
  routes,
  linkActiveClass: 'fw-bolder',
  history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
