let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;

window.addEventListener("load", function() {   
    window.scrollTo(0, 0);

    DETAILS_DIALOG_EL = document.getElementById("corkboard-item-dialog");
    // A11yDialog handles toggling accessibility properties when the dialog shows/ hides,
    // as well as closing on esc, clicking outside of the dialog, etc.
    DETAILS_DIALOG_A11Y = new A11yDialog(document.getElementById("corkboard-overlay"));
    DETAILS_DIALOG_A11Y.on('hide', function (event) {
        const dummyItem = document.getElementById("corkboard-item-dummy");
        setTimeout(() => {
            DETAILS_DIALOG_EL.classList.remove("slide-out");
            dummyItem.style = "";
        }, 500);
    })
    DETAILS_DIALOG_A11Y.hide();
});
window.addEventListener("beforeunload", function () {
    window.scrollTo(0,0);
});

class Corkboard extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
        this.role = "list";
        const options = {
            rootMargin: "20%",
            trackVisibility: true,
            threshold: 0.5,
            delay: 100,
        };
        this.observer = new IntersectionObserver(scrollIntersectionCallback, options);
        setupEntries(this);
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }
}

class CorkboardItem extends HTMLElement {
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
        this.role = "listitem";
        let imgUrl;
        if (this.hasAttribute("img")) {
          imgUrl = this.getAttribute("img");
        } else {
          imgUrl = "img/default.png";
        }

        this.imageThumb = document.createElement("img");
        this.imageThumb.src = imgUrl;
        this.appendChild(this.imageThumb);
        this.onclick = this.handleClick;
    }

    handleClick (e) {
        const overlayContainer = document.getElementById("corkboard-overlay");
        const dummyItem = document.getElementById("corkboard-item-dummy");
        dummyItem.style.top = (this.offsetTop - window.scrollY) + "px";
        dummyItem.style.left = this.offsetLeft + "px";
        dummyItem.style.width = this.offsetWidth + "px";
        dummyItem.style.height = this.offsetHeight + "px";
        dummyItem.style.rotate = this.style.rotate;
        dummyItem.innerHTML = "";
        dummyItem.appendChild(this.imageThumb.cloneNode());
        // overlayContainer.classList.add("show");
        DETAILS_DIALOG_A11Y.show();

        setTimeout(() => {
            dummyItem.style.top = "calc(50% - 40dvh)";
            dummyItem.style.left = "calc(50% - 25%)";
            dummyItem.style.width = "45%";
            dummyItem.style.height = "80dvh";
            dummyItem.style.rotate = "0deg";
        }, 500);
        setTimeout(() => {
            dummyItem.style.left = "2em";
            dummyItem.style.rotate = "-5deg";
            DETAILS_DIALOG_EL.classList.add("slide-out");
        }, 1000);
    }
}

customElements.define("corkboard-container", Corkboard);
customElements.define("corkboard-item", CorkboardItem);

function scrollIntersectionCallback (entries, observer) {
    entries.forEach((entry, i) => {
        let elem = entry.target;
        if (entry.isIntersecting && !(elem.classList.contains("visible") || elem.classList.contains("anim-in"))) {
            elem.onanimationend = (event) => {
                event.target.classList.remove("anim-in");
                elem.classList.add("visible");
                // elem.style = "";
            }
            elem.classList.add("anim-in");
            // elem.style = `animation-delay: ${Math.max(i * 0.1, 1)}s`;
        }
        else if (!entry.isIntersecting) {
            elem.classList.remove("visible");
            elem.classList.remove("anim-in");
        }
    });
}

function setupEntries (elem) {
    let plusOrMinus = 1;
    let pmCount = 0;
    for (var i = 0; i < 100; i++) {
        let childEl = new CorkboardItem();
        childEl.setAttribute("img", `https://picsum.photos/seed/${i + 100}/200/300`);
        childEl.setAttribute("entry-type", "art");
        var newPlusOrMinus = Math.random() < 0.5 ? -1 : 1;
        if (plusOrMinus === newPlusOrMinus && pmCount < 2) {
            pmCount++;
        }
        else if (plusOrMinus === newPlusOrMinus) {
            newPlusOrMinus = newPlusOrMinus * -1;
            pmCount = 0;
        }
        plusOrMinus = newPlusOrMinus;

        childEl.style = `--angle: ${Math.round((2 + Math.random() * 5) * plusOrMinus)}deg;`;
        childEl.style.top = `${Math.round((8 + Math.random() * 25 * plusOrMinus))}px`
        childEl.style.left = `${Math.round((8 + Math.random() * 25 * plusOrMinus))}px`
        childEl.style.rotate = `${Math.round((2 + Math.random() * 5 * plusOrMinus))}deg`
        childEl.style.zIndex = `${100 - i}`;

        elem.append(childEl);
        elem.observer.observe(childEl);
    }
}