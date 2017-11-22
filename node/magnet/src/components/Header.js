import Component from 'metal-component';
import Soy from 'metal-soy';
import Topbar from 'marble-topbar';
import templates from './Header.soy.js';
import {isServerSide} from 'metal';

export default class Header extends Component {
  attached() {
    if (!isServerSide()) {
      this.clicking();
    }
  }

  clicking() {
    document.addEventListener('click', (event) => {
      const $target = event.target.closest('[aria-controls]');

      if ($target) {
        const $content = document.getElementById($target.getAttribute('aria-controls'));

        if ($content) {
          const isExpanding = $content.getAttribute('aria-expanded') !== 'true';

          $target.setAttribute('aria-expanded', isExpanding);
          $content.setAttribute('aria-expanded', isExpanding);

          if ($target.hasAttribute('aria-haspopup')) {
            document.documentElement.setAttribute('data-expanded', isExpanding);

            if (isExpanding) {
              $target.parentNode.setAttribute('inert', '');
            } else {
              $target.parentNode.removeAttribute('inert');
            }
          }
        }
      }

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
