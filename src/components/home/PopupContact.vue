<template>
  <div v-if="isOpen" class="popup-overlay" @click.self="closePopup">
    <div class="popup-content">
      <button class="popup-close" @click="closePopup">×</button>

      <!-- Контент формы -->
      <section class="contact-section py-5 rounded-5">
        <div class="container-mode">
          <div class="row justify-content-center">
            <div class="col-12">
              <!-- Заголовок -->
              <div class="text-center mb-4">
                <h2 class="fw-bold">{{ $t('consultation.title') }}</h2>
                <p class="text-muted">
                  {{ $t('consultation.subtitle') }}
                </p>
              </div>


              <!-- Форма -->
              <form @submit.prevent="submitRequest">
                <!-- Сообщение об успешной отправке -->
                <div v-if="message" class="alert alert-success mt-3" style="border-radius: 15px;">
                  {{ message }}
                </div>

                <!-- Сообщение об ошибке -->
                <div v-if="errorMessage" class="alert alert-danger mt-3" style="border-radius: 15px;">
                  {{ errorMessage }}
                </div>
                <!-- Имя -->
                <div class="mb-3" style="text-align: justify;">
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
                <div class="mb-3" style="text-align: justify;">
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_URL, MEDIA_API_URL } from "@/config";

export default {
  name: "PopupContact",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      name: "",
      phone: "",
      message: null,
      errorMessage: null,
    };
  },
  methods: {
    closePopup() {
      this.$emit("close");
    },
    async submitRequest() {
      try {
        const response = await axios.post(`${MEDIA_API_URL}/admin-panel/requests/`, {
          name: this.name,
          phone: this.phone,
        });
        this.message = response.data.message; // Успешное сообщение
        this.name = "";
        this.phone = "";
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error.response.data.detail || "Произошла ошибка!";
        this.message = null;
      }
    },
  },
};
</script>

<style scoped>
/* затемнённый фон */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  overflow-y: auto;
}

/* окно попапа */
.popup-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  position: relative;
  animation: fadeIn 0.3s ease-in-out;
  margin: 10px;
}

/* крестик */
.popup-close {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
}

/* стили формы */
.container-mode {
  padding-left: 40px;
  padding-right: 40px;
}
.contact-section {
  background: #fff;
}
.btn-primary {
  background-color: #001246;
  border: none;
}
.btn-primary:hover {
  background-color: #001b66;
}
form {
  max-width: 420px;
  margin: 0 auto;
}
</style>
