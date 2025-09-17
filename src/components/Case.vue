<template>
  <div class="container-mode my-5">
    <div class="row">
      <!-- Левая часть -->
      <div class="col-lg-3 col-md-4 mb-4 d-flex flex-column justify-content-between">
        <div>
          <h2 class="fw-bold">Наши кейсы</h2>
          <p class="text-muted">
            Реальные кейсы — как мы выстраиваем коммуникации,
            повышаем доверие и расширяем горизонты бизнеса
          </p>
        </div>
        <div class="d-flex gap-2">
          <button
            class="btn btn-light border rounded-circle"
            data-bs-target="#casesCarousel"
            data-bs-slide="prev"
          >
            <i class="bi bi-arrow-left"></i>
          </button>
          <button
            class="btn btn-light border rounded-circle"
            data-bs-target="#casesCarousel"
            data-bs-slide="next"
          >
            <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Правая часть: слайдер -->
      <div class="col-lg-9 col-md-8">
        <div id="casesCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">

            <!-- Слайд 1 -->
            <div class="carousel-item active">
              <div class="row">
                <!-- Первая карточка видна всегда -->
                <div class="col-12 col-md-4">
                  <img src="assets/img/city.png" class="d-block w-100 rounded" alt="...">
                  <p class="mt-2">Город рабочих профессий</p>
                </div>
                <!-- Остальные видны только на md+ -->
                <div class="col-md-4 d-none d-md-block">
                  <img src="assets/img/aif.png" class="d-block w-100 rounded" alt="...">
                  <p class="mt-2">AIF 2023</p>
                </div>
                <div class="col-md-4 d-none d-md-block">
                  <img src="assets/img/city.png" class="d-block w-100 rounded" alt="...">
                  <p class="mt-2">HCD 2022 – н.в.</p>
                </div>
              </div>
            </div>

            <!-- Слайд 2 -->
            <div class="carousel-item">
              <div class="row">
                <div class="col-12 col-md-4">
                  <img src="assets/img/aif.png" class="d-block w-100 rounded" alt="...">
                  <p class="mt-2">Кейс 4</p>
                </div>
                <div class="col-md-4 d-none d-md-block">
                  <img src="assets/img/city.png" class="d-block w-100 rounded" alt="...">
                  <p class="mt-2">Кейс 5</p>
                </div>
                <div class="col-md-4 d-none d-md-block">
                  <img src="assets/img/aif.png" class="d-block w-100 rounded" alt="...">
                  <p class="mt-2">Кейс 6</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
img {
  object-fit: cover;
}
</style>

<script>
export default {
  name: 'Case'
}
</script>
