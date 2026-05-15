import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue'),
    meta: { title: 'Início' }
  },
  {
    path: '/produtos', 
    name: 'Products',
    component: () => import('../pages/Products.vue'),
    meta: { title: 'Cardápio' }
  },
  // Redirecionando para Home enquanto você não cria os arquivos .vue dessas páginas
  { path: '/eventos', name: 'Events', component: () => import('../pages/Home.vue') },
  { path: '/jogos', name: 'Games', component: () => import('../pages/Home.vue') },
  { path: '/comunidade', name: 'Community', component: () => import('../pages/Home.vue') },
  { path: '/aluguel', name: 'SpaceRental', component: () => import('../pages/Home.vue') },
  
  {
    path: '/produto/:id',
    name: 'ProductDetail',
    component: () => import('../pages/ProductDetail.vue'),
    meta: { title: 'Detalhes do Produto' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { title: 'Login', guestOnly: true }
  },
  {
    path: '/cadastro',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
    meta: { title: 'Cadastro', guestOnly: true }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('../pages/Profile.vue'),
    meta: { title: 'Meu Perfil', requiresAuth: true }
  },
  {
    path: '/carrinho',
    name: 'Cart',
    component: () => import('../pages/Cart.vue'),
    meta: { title: 'Carrinho' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../pages/Checkout.vue'),
    meta: { title: 'Checkout', requiresAuth: true }
  },
  {
    path: '/pedidos',
    name: 'Orders',
    component: () => import('../pages/Orders.vue'),
    meta: { title: 'Meus Pedidos', requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../pages/admin/Dashboard.vue'),
    meta: { title: 'Painel Administrativo', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue'),
    meta: { title: 'Página não encontrada' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  document.title = to.meta.title ? `${to.meta.title} | Adega Premium` : 'Adega Premium'

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  next()
})

export default router