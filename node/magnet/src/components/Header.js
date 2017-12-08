import Component from 'metal-component';
import Soy from 'metal-soy';
import templates from './Header.soy.js';
import Topbar from 'marble-topbar';
import {isServerSide} from 'metal';

export default class Header extends Component {
  attached() {
    if (!isServerSide()) {
      this.clicking();
    }
  }

  clicking() {
    document.addEventListener('click', (event) => {
      const $pricingTarget = event.target.closest('[href="#pricing"]');

      if ($pricingTarget) {
        const $list = document.querySelector('.nav-list');
        const $toggle = document.querySelector('.nav-toggle');

        document.documentElement.setAttribute('data-expanded', false);

        $toggle.parentNode.setAttribute('aria-expanded', false);

        $list.parentNode.setAttribute('aria-expanded', false);

        $list.parentNode.removeAttribute('inert');
      }
    });
  }
}

Soy.register(Header, templates);
