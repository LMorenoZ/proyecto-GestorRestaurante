// librerias
import { createRouter, createWebHistory } from 'vue-router';

// stores
import { useUserStore } from './stores/users';

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
        component: () => import('./views/HomeView.vue'),
        beforeEnter: existeSesion
    },
    {
        path: '/mesas',
        component: () => import('./views/MesasView.vue'),
        beforeEnter: comprobarSesion
    },
    {
        path: '/menu',
        component: () => import('./views/Menu/MenuView.vue'),
        beforeEnter: comprobarSesion
    },
    {
        path: '/menu/nuevo',
        component: () => import('./views/Menu/ProductoCrearView.vue'),
        beforeEnter: sesionAdmin
    },
    {
        path: '/menu/editar/:id',
        component: () => import('./views/Menu/EditarProductoView.vue'),
        beforeEnter: sesionAdmin
    },
    {
        path: '/ordenes',
        component: () => import('./views/OrdenesView.vue'),
        beforeEnter: comprobarSesion
    },
    {
        path: '/administracion/',
        redirect: { path: "/administracion/empleados" },
        component: () => import('./views/AdministracionView.vue'),
        children: [
            { path: 'empleados', 
                components: {seccionAdmin: () => import('./views/AdminViews/AdminEmpleadosView.vue')}
            },
            { path: 'informes', 
                components: {seccionAdmin: () => import('./views/AdminViews/AdminInformesView.vue')}
            },
            { path: 'crear_usuario', 
                components: {seccionAdmin: () => import('./views/AdminViews/CrearUsuarioView.vue')}
            },
            { path: 'perfil/:id', 
                components: {seccionAdmin: () => import('./views/AdminViews/UserProfileView.vue')}
            }
        ],
        beforeEnter: sesionAdmin
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'NotFound', 
        component: () => import('./views/404NotFoundView.vue'),
        beforeEnter: comprobarSesion
    },
];

const router = createRouter({
  routes,
  linkActiveClass: 'fw-bolder',
  history: createWebHistory(import.meta.env.BASE_URL),
});

export default router;
