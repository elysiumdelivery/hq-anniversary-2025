class GlobalHeader extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
        this.innerHTML = `  <button id="hamburger-button" role="navigation" aria-controls="main-menu"><img aria-hidden="true" focusable="false" src="icons/Icons_Hamburger.svg"/></button>
                            <img id="logo" src="/image-resize/full/logo.png"/>
                            <nav>
                                <div class="nav-inner">
                                    <a href="/">Home</a>
                                    <a href="/corkboard.html">Corkboard</a>
                                    <a href="/ads.html">Ads</a>
                                    <a href="/review.html">Review</a>
                                    <a href="/receipt.html">Receipt</a>
                                </div>
                            </nav>
                            <div id="hamburger-menu" role="navigation" aria-label="Main menu">
                                <button class="close"><img aria-hidden="true" focusable="false" src="icons/Icons_Close.svg"/></button>
                                <h2>navigation</h2>
                                <a href="/">Home</a>
                                <a href="/corkboard.html">Corkboard</a>
                                <a href="/ads.html">Ads</a>
                                <a href="/review.html">Review</a>
                                <a href="/receipt.html">Receipt</a>
                            </div>`;
        this.setup();
    }

    setup() {
        const hamburgButton = document.getElementById("hamburger-button");
        const hamburgMenu = document.getElementById("hamburger-menu");
    
        hamburgMenu.style.display = "none";
        hamburgMenu.tabIndex = -1;
    
        hamburgButton.onclick = () => {
            hamburgMenu.style.display = "flex";
            hamburgMenu.ariaExpanded = true;
            hamburgMenu.focus();
            requestAnimationFrame(() => { hamburgMenu.classList.add("open"); })
        }
    
        hamburgMenu.querySelector(".close").onclick = () => {
            hamburgMenu.classList.remove("open");
            hamburgButton.focus();
            hamburgMenu.ariaExpanded = false;
        }
    
        hamburgMenu.ontransitionend = (ev) => {
            if (!hamburgMenu.classList.contains("open")) {
                hamburgMenu.style.display = "none";
                hamburgMenu.ariaExpanded = false;
            }
            else {
            }
        }
    }
}
  
customElements.define("global-header", GlobalHeader);
  