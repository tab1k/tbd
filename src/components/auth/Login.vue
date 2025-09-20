<template>
  <div>
    <h2>Вход</h2>
    <form @submit.prevent="login">
      <input v-model="username" type="text" placeholder="Имя пользователя" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <button type="submit">Войти</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import API from "@/axios-config";
import { MEDIA_API_URL } from "@/config";

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
        this.errorMessage = "Неверные данные для входа";
      }
    },
  },
};
</script>
