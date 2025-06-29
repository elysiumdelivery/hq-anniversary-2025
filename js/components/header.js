class GlobalHeader extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
        this.innerHTML = `  <button id="hamburger-button" role="navigation" aria-controls="main-menu"><img aria-hidden="true" focusable="false" src="/image-resize/50/sidebar_open.png"/></button>
                            <img id="logo" src="/image-resize/full/logo.png"/>
                            <nav>
                                <div class="nav-inner">
                                    <a href="/"><img alt="Home" focusable="false" src="/image-resize-h/50/nav/home.png"/></a>
                                    <a href="/corkboard.html"><img alt="Corkboard" focusable="false" src="/image-resize-h/50/nav/corkboard.png"/></a>
                                    <a href="/ads.html"><img alt="Ads" focusable="false" src="/image-resize-h/50/nav/ads.png"/></a>
                                    <a href="/review.html"><img alt="Review" focusable="false" src="/image-resize-h/50/nav/review.png"/></a>
                                    <a href="/social.html"><img alt="Social Media Gallery" focusable="false" src="/image-resize-h/50/nav/socmed.png"/></a>
                                    <a href="/receipt.html"><img alt="Receipt" focusable="false" src="/image-resize-h/50/nav/receipt.png"/></a>
                                </div>
                            </nav>
                            <div id="hamburger-menu" role="navigation" aria-label="Main menu">
                                <button class="close"><img aria-hidden="true" focusable="false" src="/image-resize/50/sidebar_close.png"/></button>
                                <h2>navigation</h2>
                                <a href="/"><img alt="Home" focusable="false" src="/image-resize-h/50/nav/home.png"/></a>
                                <a href="/corkboard.html"><img alt="Corkboard" focusable="false" src="/image-resize-h/50/nav/corkboard.png"/></a>
                                <a href="/ads.html"><img alt="Ads" focusable="false" src="/image-resize-h/50/nav/ads.png"/></a>
                                <a href="/review.html"><img alt="Review" focusable="false" src="/image-resize-h/50/nav/review.png"/></a>
                                <a href="/social.html"><img alt="Social Media Gallery" focusable="false" src="/image-resize-h/50/nav/socmed.png"/></a>
                                <a href="/receipt.html"><img alt="Receipt" focusable="false" src="/image-resize-h/50/nav/receipt.png"/></a>
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
  