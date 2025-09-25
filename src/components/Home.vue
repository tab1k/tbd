<template>
  <div>
    <Hero />
    
    <div data-aos="fade-up" data-aos-delay="100">
      <About />
    </div>
    
    <div data-aos="fade-left" data-aos-delay="200">
      <Team />
    </div>
    
    <div data-aos="fade-right" data-aos-delay="300">
      <Partners />
    </div>
    
    <div data-aos="zoom-in" data-aos-delay="400">
      <Direction />
    </div>
    
    <div data-aos="none">
      <Case />
    </div>
    
    <div data-aos="fade-up" data-aos-delay="400">
      <Contacts />
    </div>
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

import AOS from 'aos';
import 'aos/dist/aos.css';

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
  },
  mounted() {
    AOS.init({
      duration: 800,        // длительность анимации
      once: true,           // анимация только один раз
      offset: 100,          // когда начинать анимацию (px от верха экрана)
      delay: 0,             // задержка по умолчанию
      easing: 'ease-in-out' // плавность анимации
    });
  }
};
</script>