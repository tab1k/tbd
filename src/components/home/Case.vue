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
            <!-- Перебираем кейсы и создаем слайды -->
            <div 
              class="carousel-item" 
              v-for="(caseItem, index) in cases" 
              :key="caseItem.id" 
              :class="{'active': index === 0}"
            >
              <div class="row">
                <!-- Поскольку у каждого кейса одно изображение, отображаем только его -->
                <div class="col-12 col-md-4">
                  <img 
                    :src="`MEDIA_API_URL${caseItem.image}`" 
                    class="d-block w-100 rounded" 
                    :alt="caseItem.title"
                  >
                  <p class="mt-2">{{ caseItem.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Case',
  data() {
    return {
      cases: [],  // Массив для хранения данных о кейсах
    };
  },
  async created() {
    try {
      const response = await axios.get(API_URL);
      this.cases = response.data.cases;  // Получаем все кейсы
    } catch (error) {
      console.error('Error fetching cases data:', error);
    }
  },
}
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
}
img {
  object-fit: cover;
}
</style>
