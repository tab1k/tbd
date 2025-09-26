<template>
  <section id="contacts" class="contact-section py-5 mb-5">
    <!-- Бегущая строка (только для мобильных) -->
    <div class="marquee d-md-none mb-5">
      <span>📞 Свяжитесь с нами прямо сейчас — мы вам поможем!</span>
    </div>

    <div class="container-mode">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-6 col-12">
          <!-- Заголовок -->
          <div class="text-center mb-4">
            <h2 class="fw-bold">{{ $t('consultation.title') }}</h2>
            <p class="text-muted">
              {{ $t('consultation.subtitle') }}
            </p>
          </div>

          <!-- Форма -->
          <form @submit.prevent="submitForm">
            <!-- Сообщение об успешной отправке -->
            <div v-if="message" class="alert alert-success mt-3" style="border-radius: 15px;">
              {{ message }}
            </div>

            <!-- Сообщение об ошибке -->
            <div v-if="errorMessage" class="alert alert-danger mt-3" style="border-radius: 15px;">
              {{ errorMessage }}
            </div>

            <!-- Имя -->
            <div class="mb-3">
              <label for="name" class="form-label">{{ $t('consultation.name') }}</label>
              <input
                v-model="name"
                type="text"
                class="form-control"
                id="name"
                placeholder="Ваше имя"
                required
              />
            </div>

            <!-- Телефон -->
            <div class="mb-3">
              <label for="phone" class="form-label">{{ $t('consultation.phone') }}</label>
              <input
                v-model="phone"
                type="tel"
                class="form-control"
                id="phone"
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>

            <!-- Кнопка -->
            <div class="d-grid mt-4">
              <button type="submit" class="btn btn-primary btn-lg rounded-pill">
                {{ $t('common.request') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { API_URL, MEDIA_API_URL } from "@/config";

export default {
  name: "ContactForm",
  data() {
    return {
      name: "",
      phone: "",
      message: null,
      errorMessage: null
    };
  },
  methods: {
    async submitForm() {
      try {
        // Отправка данных формы на сервер
        const response = await axios.post(`${MEDIA_API_URL}/admin-panel/requests/`, {
          name: this.name,
          phone: this.phone
        });
        // Успешное сообщение
        this.message = response.data.message;
        this.name = "";
        this.phone = "";
        this.errorMessage = null;
      } catch (error) {
        // Сообщение об ошибке
        this.errorMessage = error.response?.data?.detail || "Произошла ошибка!";
        this.message = null;
      }
    }
  }
};
</script>

<style scoped>
.container-mode {
  padding-left: 80px;
  padding-right: 80px;
}

@media (max-width: 768px) {
  .container-mode {
    padding-left: 30px;
    padding-right: 30px;
  }

  h2.fw-bold {
    text-align: start;
  }

  p.text-muted {
    text-align: start;
  }
}

/* Секция */
.contact-section {
  background: #fff;
}

/* Кнопка */
.btn-primary {
  background-color: #001246;
  border: none;
}
.btn-primary:hover {
  background-color: #001b66;
}


/* Ограничение ширины формы */
form {
  max-width: 420px;
  margin: 0 auto;
}

/* Бегущая строка */
.marquee {
  width: 100%;
  overflow: hidden;
  background: #001246;
  color: #fff;
  white-space: nowrap;
  padding: 10px 0;
  font-size: 16px;
  font-weight: bold;
}

.marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 12s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
