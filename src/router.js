// librerias
import { createRouter, createWebHistory } from 'vue-router';

// stores
import { useUserStore } from './stores/users';
import { useJornadaStore } from './stores/jornada';

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
    // const jornadaStore = useJornadaStore()
    const userStore = useUserStore();

    await userStore.currentUser();
    if (userStore.userRol === 'admin') {

        // if (jornadaStore.jornadaActiva) {
        //     next('/administracion');
        // } else {
        //     next();
        // }

        next();
    } else {
        next('/');
    }
}

// guardia que impide acceder a la vistas para editar o crear informacion cuando la jornada esta activa
const jornadaActivaGuard = async (to, from, next) => {   
    const jornadaStore = useJornadaStore()

    if (!jornadaStore.jornadaActiva) {
        next();
    } else {
        next('/administracion');
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
        beforeEnter: [sesionAdmin, jornadaActivaGuard]
    },
    {
        path: '/menu/editar/:id',
        component: () => import('./views/Menu/EditarProductoView.vue'),
        // beforeEnter: sesionAdmin
        beforeEnter: [sesionAdmin, jornadaActivaGuard]
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
                components: {seccionAdmin: () => import('./views/AdminViews/CrearUsuarioView.vue')},
                beforeEnter: jornadaActivaGuard
            },
            { path: 'perfil/:id', 
                components: {seccionAdmin: () => import('./views/AdminViews/UserProfileView.vue')}
            },
            { path: 'editar/:id', 
                components: {seccionAdmin: () => import('./views/AdminViews/EditarUsuarioView.vue')},
                beforeEnter: jornadaActivaGuard
            },
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
