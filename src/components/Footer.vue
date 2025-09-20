<template>
  <footer class="footer py-5">
    <div class="container-mode">
      <div class="row align-items-start">
        <!-- Левая часть -->
        <div class="col-12 col-md-3 mb-4 mb-md-0">
          <div class="d-flex align-items-center mb-3">
            <img src="/logo.png" alt="Logo" class="footer-logo me-2" />
          </div>
          <!-- Соцсети -->
          <div class="d-flex gap-3">
            <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
            <a href="#" class="social-icon"><i class="bi bi-linkedin"></i></a>
            <a href="#" class="social-icon"><i class="bi bi-whatsapp"></i></a>
          </div>
        </div>

        <!-- Контакты -->
        <div class="col-6 col-md-2 mb-3">
          <h6 class="fw-bold">Казахстан</h6>
          <p class="mb-0">+7 701 437 82 32</p>
          <p class="mb-0">marinali@tbd.bz</p>
        </div>
        <div class="col-6 col-md-2 mb-3">
          <h6 class="fw-bold">США</h6>
          <p class="mb-0">+1 949 903 1678</p>
          <p class="mb-0">tbd@tbd.bz</p>
        </div>
        <div class="col-6 col-md-2 mb-3">
          <h6 class="fw-bold">Узбекистан</h6>
          <p class="mb-0">+998 90 826 9530</p>
          <p class="mb-0">ibrayevaalt@tbd.bz</p>
        </div>
        <div class="col-6 col-md-3 mb-3">
          <h6 class="fw-bold">Азербайджан</h6>
          <p class="mb-0">+994 55 224 4640</p>
          <p class="mb-0">nhuseynzade@gmail.com</p>
        </div>
      </div>

      <!-- Нижняя полоса -->
      <div class="row mt-4 pt-3 ">
        <div class="col-6 text-start">
          <p class="mb-0">© 2025. Все права защищены.</p>
        </div>
        <div class="col-6 text-end">
          <p class="mb-0">
            Created with <span class="text-primary">💙</span> at ZIZ Inc.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.container-mode {
  padding-left: 30px;
  padding-right: 30px;
}
.footer {
  background-color: #f8f9fa;
  color: #2d2f48;
  font-size: 14px;
}

.footer-logo {
  height: 35px;
}

.social-icon {
  font-size: 20px;
  color: #666f8e;
  transition: 0.3s;
}
.social-icon:hover {
  color: #001246;
}
</style>


