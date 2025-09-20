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
            <h2 class="fw-bold">Найдём решение под вас</h2>
            <p class="text-muted">
              Заполните форму — мы свяжемся с вами в ближайшее время
            </p>
          </div>

          <!-- Форма -->
          <form>
            <!-- Имя -->
            <div class="mb-3">
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
            <div class="mb-3">
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
</template>

<script>
export default {
  name: "ContactForm",
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
