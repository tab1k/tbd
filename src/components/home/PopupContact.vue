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
                <h2 class="fw-bold">Найдём решение под вас</h2>
                <p class="text-muted">
                  Заполните форму — мы свяжемся с вами в ближайшее время
                </p>
              </div>

              <!-- Форма -->
              <form>
                <!-- Имя -->
                <div class="mb-3" style="text-align: justify;">
                  <label for="name" class="form-label">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Ваше имя"
                    required
                  />
                </div>

                <!-- Телефон -->
                <div class="mb-3" style="text-align: justify;">
                  <label for="phone" class="form-label">Телефон</label>
                  <input
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
                    Оставить заявку
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
export default {
  name: "PopupContact",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["close"],
  methods: {
    closePopup() {
      this.$emit("close");
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
