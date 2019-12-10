const tagName = 'lazy-image';
const template = document.createElement('template');
template.innerHTML = `<img id="image"/>`;

class LazyImage extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }
}

const register = () => customElements.define(tagName, LazyImage);
window.WebComponents ? window.WebComponents.waitFor(register) : register();
