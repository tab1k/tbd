<template>
  <section class="py-5 ">
    <div class="container-mode">
      <h2 class="section-title">В нашей команде</h2>
      <!-- g-2 уменьшает отступы между колонками -->
      <div class="row text-center g-2">
        <div class="col-md-3">
          <div class="team-card">
            <div class="photo">
              <img src="assets/img/zhanar.png" alt="">
            </div>
            <h5 class="mt-3">Жанар Бекбасова</h5>
            <p>Директор TBD</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="team-card">
            <div class="photo">
              <img src="assets/img/altynai.png" alt="">
            </div>
            <h5 class="mt-3">Алтынай</h5>
            <p>Project & Sales Manager</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="team-card">
            <div class="photo">
              <img src="assets/img/ulyana.png" alt="">
            </div>
            <h5 class="mt-3">Ульяна</h5>
            <p>Project Manager Uzbekistan</p>
          </div>
        </div>
        <!-- пустая колонка для четвертой карточки -->
        <div class="col-md-3"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.team-card {
  padding: 0px; /* меньше внутренний отступ */
}

.photo {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 12px;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>

<script>
export default {
  name: 'Team',
}
</script>
