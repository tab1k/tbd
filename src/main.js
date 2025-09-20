import { createApp } from 'vue';
import App from './App.vue';  // Это основной компонент
import router from './router';
import axios from './axios-config';

createApp(App)
  .use(router) 
  .mount('#app');
