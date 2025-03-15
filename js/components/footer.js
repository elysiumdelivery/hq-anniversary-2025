class GlobalFooter extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
        this.innerHTML = `  <footer>
                                <a href="https://twitter.com/ElysiumDelivery">powered by elysium delivery services</a>
                            </footer>`;
    }
}
  
customElements.define("global-footer", GlobalFooter);
  