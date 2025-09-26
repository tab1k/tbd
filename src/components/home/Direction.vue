<template>
  <section id="services" class="py-5 bg-light">
    <div class="container-mode">
      <h2 class="section-title mb-4">{{ $t('services.title') }}</h2>

      <div class="row g-4">
        <!-- Карточка 1 -->
        <div class="col-12 col-md-6">
          <p class="title">{{ $t('services.pr.title') }}</p>
          <p>{{ $t('services.pr.description') }}</p>
          <p>{{ $t('services.pr.description2') }}</p>
        </div>

        <!-- Карточка 2 -->
        <div class="col-12 col-md-6">
          <p class="title">{{ $t('services.gr.title') }}</p>
          <p>
           {{ $t('services.gr.description') }}
          </p>
        </div>

        <!-- Карточка 3 -->
        <div class="col-12 col-md-6">
          <p class="title">{{ $t('services.events.title') }}</p>
          <p>{{ $t('services.events.description') }}</p>
          <p>
            {{ $t('services.events.description_two') }}
          </p>
        </div>

        <!-- Карточка 4 -->
        <div class="col-12 col-md-6">
          <p class="title">{{ $t('services.promotion.title') }}</p>
          <p>
            {{ $t('services.promotion.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-title {
  font-weight: 700;
  font-size: 1.8rem;
}

.container-mode p.title {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.container-mode p:not(.title) {
  margin-bottom: 1rem;
}

/* Стили для контейнера с отступами */
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
</style>

<script>
export default {
  name: 'Direction'
}
</script>
