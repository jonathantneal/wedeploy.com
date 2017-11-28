import Component from 'metal-component';
import perlin from 'perlin-noise';
import Soy from 'metal-soy';
import templates from './Bubbles.soy.js';
import {Config} from 'metal-state';
import {isServerSide} from 'metal';

export default class Bubbles extends Component {
  created() {
    this.assertImagesAndPositionsSameSize();
  }

  assertImagesAndPositionsSameSize() {
    if (this.images.length !== this.positions.length) {
      throw new Error('Number of images must match number of positions');
    }
  }

  attached() {
    if (isServerSide()) {
      return;
    }

    this.setupBubbles();
    this.generatePerlinNoise();
    this.prepareAnimation();
  }

  prepareAnimation() {
    let top, timeout;

    const onscroll = event => {
      // conditionally update an undefined top
      if (top === undefined) {
        top = this.element.getBoundingClientRect().top + window.pageYOffset;
      }

      // allow the top to be refreshed after a debounce
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        top = undefined;
      }, 400);

      // undo the listener and begin the animation if the top has been passed
      if (window.innerHeight + window.pageYOffset >= top) {
        window.removeEventListener('scroll', onscroll);

        this.startAnimation();
      }
    };

    window.addEventListener('scroll', onscroll);
  }

  disposed() {
    this.bubbles = null;
    this.animate = false;
  }

  setupBubbles() {
    this.translate = [];
    for (let i = 0; i < this.images.length; i++) {
      this.translate[i] = 0;
    }
    this.bubbles = this.element.querySelectorAll('.bubble');
  }

  generatePerlinNoise() {
    this.noise = [];
    for (let i = 0; i < this.images.length; i++) {
      this.noise.push(
        perlin.generatePerlinNoise(this.width, 1, {octaveCount: 9})
      );
    }
  }

  getNoiseFactor(i) {
    return 40 * this.noise[i][Math.round(Math.abs(this.translate[i]))];
  }

  startAnimation() {
    this.animate = true;
    this.tick();
  }

  stopAnimation() {
    this.animate = false;
  }

  tick() {
    if (!this.animate) {
      return;
    }
    for (let i = 0; i < this.images.length; i++) {
      const bubble = this.bubbles[i];
      if (bubble) {
        this.translate[i] -= this.velocity;
        const left = this.positions[i].left;
        const size = this.positions[i].size;
        const translateX = this.translate[i] + this.getNoiseFactor(i);
        const translateY = this.getNoiseFactor(i);
        const transform = `translate(${translateX}px, ${translateY}px)`;
        bubble.style.transform = transform;
        if (translateX <= -(left + size)) {
          // Aligns right the bubble hidden on the left of the viewport
          this.translate[i] = this.width - left - size;
        }
      }
    }
    window.requestAnimationFrame(() => this.tick());
  }
}

Bubbles.STATE = {
  velocity: Config.number().value(0.5),
  width: Config.number().value(2200),
  images: Config.internal()
    .array()
    .value([
      'apache',
      'php',
      'drupal',
      'dxp',
      'elasticsearch',
      'ghost',
      'go',
      'gradle',
      'java',
      'kibana',
      'mongodb',
      'mysql',
      'nginx',
      'nodejs',
      'docker',
      'postgres',
      'python',
      'redis',
      'ruby',
      'tomcat',
      'wordpress',
      'rocketchat',
      'influxdb',
      'jenkins',
      'django',
      'rabbitmq',
      'rethinkdb',
      'pearl',
      'neo4j',
    ]),
  positions: Config.internal()
    .array()
    .value([
      {top: 12, left: 15, size: 90}, // apache
      {top: 160, left: -45, size: 120}, // php
      {top: 338, left: 6, size: 90}, // drupal
      {top: 176, left: 148, size: 120}, // dxp
      {top: 54, left: 247, size: 90}, // elasticsearch
      {top: 318, left: 280, size: 120}, // ghost
      {top: 138, left: 370, size: 120}, // go
      {top: 288, left: 484, size: 120}, // gradle
      {top: 205, left: 655, size: 120}, // java
      {top: 48, left: 788, size: 120}, // kibana
      {top: 264, left: 858, size: 90}, // mongodb
      {top: 27, left: 989, size: 90}, // mysql
      {top: 360, left: 1027, size: 90}, // nginx
      {top: 180, left: 1000, size: 150}, // nodejs
      {top: 144, left: 1185, size: 120}, // docker
      {top: 56, left: 550, size: 90}, // postgres
      {top: 340, left: 1220, size: 120}, // python
      {top: 67, left: 1400, size: 120}, // redis
      {top: 360, left: 694, size: 120}, // ruby
      {top: 260, left: 1400, size: 90}, // tomcat
      {top: 13, left: 1200, size: 90}, // wordpress
      {top: 158, left: 1970, size: 120}, // rocketchat
      {top: 270, left: 1783, size: 120}, // influxdb
      {top: 78, left: 1754, size: 120}, // jenkins
      {top: 323, left: 1556, size: 120}, // django
      {top: 175, left: 1594, size: 120}, // rabbitmq
      {top: 13, left: 1560, size: 90}, // rethinkdb
      {top: 32, left: 1993, size: 90}, // pearl
      {top: 352, left: 1993, size: 90}, // neo4j
    ]),
};

Soy.register(Bubbles, templates);
