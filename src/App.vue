<template>
  <div id="app">
    <Header />
    <Hero />
    <About />
    <Team />
    <Partners />
    <Direction />
    <Case />
    <Contacts />
    <Footer />
  </div>
</template>

<style>
* {
  font-family: 'Inter', sans-serif;
  font-weight: 5400;
}
body {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
}

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
import Header from './components/Header.vue'
import About from './components/About.vue'
import Hero from './components/Hero.vue'
import Team from './components/Team.vue'
import Partners from './components/Partners.vue'
import Direction from './components/Direction.vue'  
import Case from './components/Case.vue'  
import Contacts from './components/Contacts.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    About,
    Hero,
    Team,
    Partners,
    Direction,
    Case,
    Contacts,
    Footer
  }
}
</script>