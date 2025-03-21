let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;

let photos = ["Food1",  "Mem3", "Food5", "Mem1",  "Food3", "Mem5"]

window.addEventListener("DOMContentLoaded", function() {   
    window.scrollTo(0, 0);

    DETAILS_DIALOG_EL = document.getElementById("corkboard-item-dialog");
    // A11yDialog handles toggling accessibility properties when the dialog shows/ hides,
    // as well as closing on esc, clicking outside of the dialog, etc.
    DETAILS_DIALOG_A11Y = new A11yDialog(document.getElementById("corkboard-overlay"));
    DETAILS_DIALOG_A11Y.on('hide', function (event) {
        const dummyItem = document.getElementById("corkboard-item-dummy");
        setTimeout(() => {
            DETAILS_DIALOG_EL.parentNode.classList.remove("sparkle-in");
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
          imgUrl = "images/default.png";
        }

        this.imageThumb = document.createElement("img");
        // this.image = document.createElement("img");
        // this.imageThumb.src = imgUrl;
        this.appendChild(this.imageThumb);
        // this.appendChild(this.image);
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
        let image = document.createElement("img");
        image.src = `images/corkboard_photos/${this.getAttribute("photo-key")}-full.png`;
        // dummyItem.appendChild(this.imageThumb.cloneNode());
        dummyItem.appendChild(image)

        // overlayContainer.classList.add("show");
        DETAILS_DIALOG_A11Y.show();

        if (this.type != "memory") {
            DETAILS_DIALOG_EL.style.display = "none";
            document.getElementById("sparkle-effects").style.display = "";
        }
        else {
            DETAILS_DIALOG_EL.style.display = "";
            document.getElementById("sparkle-effects").style.display = "none";
        }

        setTimeout(() => {
            dummyItem.style.top = "calc(50% - 40vh - 1em)";
            dummyItem.style.height = "80dvh";
            dummyItem.style.rotate = "0deg";

            if (this.type == "food") {
                let sparkleEffect = document.getElementById("sparkle-effects");
                let ratio = image.naturalWidth / image.naturalHeight;
                console.log(ratio)
                console.log(ratio * vh(80))
                dummyItem.style.left = `calc(50% - ${ratio * vh(80) * 0.5}px)`;
                dummyItem.style.width = `${vh(80) * ratio}px`;
                sparkleEffect.style.width = `${vh(80) * ratio}px`;
                sparkleEffect.style.height = `${vh(80)}px`;
            }
            else if (this.type == "memory") {
                dummyItem.style.left = "calc(50% - 25%)";
                dummyItem.style.width = "45%";
            }
        }, 500);
        
        setTimeout(() => {
            if (this.type == "memory") {
                dummyItem.style.left = "2em";
                dummyItem.style.rotate = "-5deg";
                DETAILS_DIALOG_EL.classList.add("slide-out");
            }
            else if (this.type == "food") {
                DETAILS_DIALOG_EL.parentNode.classList.add("sparkle-in");
            }
        }, 1000);
    }
}

customElements.define("corkboard-container", Corkboard);
customElements.define("corkboard-item", CorkboardItem);

function scrollIntersectionCallback (entries, observer) {
    entries.forEach((entry, i) => {
        let elem = entry.target;
        if (entry.isIntersecting && !(elem.classList.contains("visible"))) {
            elem.onanimationend = (event) => {
                if (event.animationName == "corkboard-item-anim-in") {
                    elem.classList.add("visible");
                    elem.classList.remove("anim-in");
                }
            }
            elem.classList.add("anim-in");
            elem.imageThumb.src = elem.getAttribute("img");
        }
        if (entry.isIntersecting) {
            elem.classList.remove("content-hidden");
        }
        else if (!entry.isIntersecting) {
            elem.classList.add("content-hidden");
        }
    });
}

function setupEntries (elem) {
    let plusOrMinus = 1;
    let pmCount = 0;
    for (var i = 0; i < photos.length; i++) {
        let photoKey = photos[i];
        let childEl = new CorkboardItem();
        // childEl.setAttribute("img", `https://picsum.photos/seed/${i + 100}/200/300`);
        childEl.setAttribute("img", `images/corkboard_photos/${photoKey}.png`);
        if (photoKey.includes("Food")) childEl.type = "food";
        if (photoKey.includes("Mem")) childEl.type = "memory";
        childEl.setAttribute("photo-key", photoKey);
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

function vh (percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}