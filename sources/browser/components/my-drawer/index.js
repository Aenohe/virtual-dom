/* Custom Element */

class MyCurrency extends HTMLElement {
  constructor() {
    super()

    let shadowRoot = this.attachShadow({ mode: 'open' })
  }
}

customElements.define('my-drawer', MyDrawer)
