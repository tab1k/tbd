<template>
  <div>
    <Hero />
    <About />
    <Team />
    <Partners />
    <Direction />
    <Case />
    <Contacts />
  </div>
</template>

<script>
import Hero from './home/Hero.vue';
import About from './home/About.vue';
import Team from './home/Team.vue';
import Partners from './home/Partners.vue';
import Direction from './home/Direction.vue';
import Case from './home/Case.vue';
import Contacts from './home/Contacts.vue';

export default {
  name: 'Home',
  components: {
    Hero,
    About,
    Team,
    Partners,
    Direction,
    Case,
    Contacts,
  }
};
</script>
