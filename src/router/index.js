import { createRouter, createWebHistory } from 'vue-router';
import AdminPanel from '../components/AdminPanel.vue';
import AdminUsers from '../components/admin/AdminUsers.vue';
import Home from '../components/Home.vue';
import AdminCases from '../components/admin/AdminCases.vue';
import AdminTeams from '../components/admin/AdminTeams.vue'; // Добавил маршрут для команды
import AdminVideos from '../components/admin/AdminVideos.vue'; // Импорт компонента AdminVideos
import AdminRequests from '../components/admin/AdminRequests.vue';
import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  {
    path: '/', // Главная страница
    name: 'Home',
    component: Home,
  },
  {
    path: '/admin', // Главная админ панель
    name: 'AdminPanel',
    component: AdminPanel,
  },
  {
    path: '/admin/users', // Страница пользователей
    name: 'AdminUsers',
    component: AdminUsers,
  },
  {
    path: '/admin/cases', // Страница кейсов
    name: 'AdminCases',
    component: AdminCases,
  },
  {
    path: '/admin/teams', // Страница команд (новая)
    name: 'AdminTeams',
    component: AdminTeams, // Добавил компонент AdminTeams
  },
  {
    path: '/admin/videos', // Страница видео
    name: 'AdminVideos',
    component: AdminVideos, // Компонент AdminVideos
  },
  {
    path: '/admin/requests', // Страница видео
    name: 'AdminRequests',
    component: AdminRequests, // Компонент AdminVideos
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Проверка авторизации
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token'); // Проверка, есть ли токен в локальном хранилище

  // Если пытаемся попасть в админку, но токен отсутствует
  if (to.path.startsWith('/admin') && !isAuthenticated) {
    next('/login'); // Перенаправляем на страницу входа
  } else {
    next(); // Даем пройти на страницу
  }
});

export default router;
