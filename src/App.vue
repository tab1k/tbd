<template>
  <div id="app" class="container-mode">
    <Header />
    <router-view></router-view> <!-- Здесь будут отображаться компоненты по маршруту -->
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
  },
};
</script>

