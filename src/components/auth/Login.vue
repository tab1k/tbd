<template>
  <div class="login-page">
    <form @submit.prevent="login" class="login-form">
      <h2>Вход</h2>
      <input v-model="username" type="text" placeholder="Имя пользователя" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { LOGIN_URL } from '@/config.js';
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async login() {
      try {
        console.log("Отправка запроса на логин...");
        
        const response = await axios.post(`${LOGIN_URL}/admin-panel/login/`, {
          username: this.username,
          password: this.password,
        });

        console.log("Ответ сервера:", response.data);

        if (!response.data.access) {
          throw new Error("Токен доступа не получен");
        }

        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        console.log("Токены сохранены. Перенаправление на /admin");
        
        // Пробуем перенаправить
        this.$router.push("/admin")
          .then(() => console.log("Перенаправление успешно"))
          .catch(err => console.error("Ошибка перенаправления:", err));
          
      } catch (error) {
        console.error("Ошибка входа:", error);
        this.errorMessage = error.response?.data?.error || 
                           error.message || 
                           "Ошибка входа";
      }
    },
  },
  
  mounted() {
    // Если уже авторизован - сразу перенаправляем
    if (localStorage.getItem('access_token')) {
      console.log("Пользователь уже авторизован, перенаправляем...");
      this.$router.push('/admin');
    }
  }
};
</script>

<style scoped>
.login-page {
  min-height: 80vh; /* Используем минимум 100% высоты */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebecf0;
  background-image: url('@/assets/img/hero_right.png'); /* Фоновое изображение */
  background-position: right center; /* Размещение изображения справа по центру */
  background-repeat: no-repeat; /* Не повторять фон */
}

.login-form {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 15, 66, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  margin: 20px;
}


.login-form h2 {
  margin-bottom: 24px;
  color: #000f42;
}

.login-form input {
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}

.login-form button {
  width: 100%;
  padding: 12px 16px;
  border-radius: 50px;
  border: none;
  background-color: #000f42;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-form button:hover {
  background-color: #001a6d;
}

.error {
  margin-top: 12px;
  color: #ff4d4f;
  font-size: 14px;
}
</style>
