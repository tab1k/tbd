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
import API from "@/axios-config";

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
        const response = await API.post("/admin-panel/login/", {
          username: this.username,
          password: this.password,
        });

        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);

        this.$router.push("/admin");
      } catch (error) {
        this.errorMessage = error.response?.data?.error || "Ошибка входа";
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebecf0;
}

.login-form {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 15, 66, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
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
