<template>
  <section class="contact-section py-5">
    <div class="container-mode">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-6 col-12"> <!-- поуже -->
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

/* Дополнительно — ограничение ширины на всякий случай */
form {
  max-width: 420px;
  margin: 0 auto;
}
</style>
