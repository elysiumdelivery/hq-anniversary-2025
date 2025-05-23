let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;

let photos = ["Food1",  "Mem3", "Food5", "Writing1", "Mem1",  "Food3", "Mem5"]

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
            dummyItem.parentElement.classList.remove("writing", "art", "memory");
            dummyItem.classList.value = "";
            dummyItem.style = "";
            dummyItem.style.transition = "none";
        }, 250);
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
        this.imageThumb.loading = "lazy";
        this.imageThumb.addEventListener("load", function () {
            setTimeout(function () {
                this.classList.add("anim-in");
            }.bind(this), 500);
        }.bind(this))
        // this.image = document.createElement("img");
        // this.imageThumb.src = imgUrl;
        this.appendChild(this.imageThumb);
        // this.appendChild(this.image);
        this.onmouseover = this.preloadImage;
        this.onclick = this.handleClick.bind(this);
    }

    preloadImage () {
        if (this.preloaded === undefined && this.type != "writing") {
            this.preloaded = new Image();
            this.preloaded.src = `image-resize/full/corkboard-img/${this.getAttribute("photo-key")}-full.png`;
        }
    }

    handleClick (e) {
        const dummyItem = document.getElementById("corkboard-item-dummy");
        dummyItem.parentElement.classList.add(this.type);
        let rect = this.getBoundingClientRect();
        dummyItem.style.transition = "none";
        dummyItem.style.width = rect.width + "px";
        dummyItem.style.height = rect.height + "px";
        rect = this.getBoundingClientRect();
        dummyItem.style.transform = `translate(${-dummyItem.offsetLeft}px, ${-dummyItem.offsetTop}px) translate(${rect.x}px, ${rect.y}px)`
        dummyItem.style.rotate = this.style.rotate;

        dummyItem.innerHTML = "";
        let image;
        if (this.type != "writing") {
            if (this.preloaded) {
                image = this.preloaded;
            }
            else {
                image = document.createElement("img");
                image.src = `image-resize/full/corkboard-img/${this.getAttribute("photo-key")}-full.png`;
                image.onload(() => console.log("a"))
            }
            dummyItem.appendChild(image);
            if (image.complete) {
                this.onDialogImageLoaded(image, dummyItem);
            }
            else {
                image.addEventListener('load', this.onDialogImageLoaded.bind(this, image, dummyItem))
            }
        }
        else {
            this.onDialogImageLoaded();
        }

        if (this.type == "writing") {
            DETAILS_DIALOG_EL.classList.add("writing-only");
        }

        if (this.type == "food") {
            DETAILS_DIALOG_EL.style.display = "none";
            document.getElementById("sparkle-effects").style.display = "";
        }
        else {
            DETAILS_DIALOG_EL.style.display = "";
            document.getElementById("sparkle-effects").style.display = "none";
        }
        DETAILS_DIALOG_A11Y.show();
    }

    onDialogImageLoaded (image, dummyItem) {
        setTimeout(() => {
            dummyItem.style = "";
            dummyItem.classList.add("img-load");
            if (this.type == "food") {
                let ratio = image.naturalWidth / image.naturalHeight;
                dummyItem.style.setProperty('--width', (vh(80) * ratio) + "px");
            }

        }, 500);
        
        setTimeout(() => {
            if (this.type == "writing") {
                DETAILS_DIALOG_EL.classList.add("slide-out");
            }
            else if (this.type == "memory") {
                dummyItem.style.rotate = "-5deg";
                DETAILS_DIALOG_EL.classList.add("slide-out");
            }
            else if (this.type == "food") {
                let sparkleEffect = document.getElementById("sparkle-effects");
                sparkleEffect.style.width = dummyItem.clientWidth + "px";
                sparkleEffect.style.height = dummyItem.clientHeight + "px";
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
            if (elem.getAttribute("entry-type") === "art") {
                elem.imageThumb.src = `image-resize/50/corkboard-img/${elem.getAttribute("photo-key")}.png`;
                elem.imageThumb.srcset = [
                    `image-resize/200/corkboard-img/${elem.getAttribute("photo-key")}.png    200w`,
                    `image-resize/400/corkboard-img/${elem.getAttribute("photo-key")}.png    400w`,
                ].join(",");
                elem.imageThumb.sizes = [
                    "(max-width: 450px) 200px",
                    "(max-width: 850px) 400px",
                    "400px"
                ].join(",");
            }
            else {
                elem.imageThumb.src = `image-resize/50/corkboard/writing_thumb.png`;
                elem.imageThumb.srcset = [
                    `image-resize/200/corkboard/writing_thumb.png    200w`,
                    `image-resize/400/corkboard/writing_thumb.png    400w`,
                ].join(",");
                elem.imageThumb.sizes = [
                    "(max-width: 450px) 200px",
                    "(max-width: 850px) 400px",
                    "400px"
                ].join(",");
            }
            if (elem.imageThumb.complete) {
                elem.classList.add("anim-in");
            }
            observer.unobserve(entry.target);
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
        childEl.setAttribute("img", `corkboard-img/${photoKey}.png`);
        childEl.setAttribute("photo-key", photoKey);
        childEl.setAttribute("entry-type", "art");
        if (photoKey.includes("Food")) childEl.type = "food";
        if (photoKey.includes("Mem")) childEl.type = "memory";
        if (photoKey.includes("Writing")) {
            childEl.type = "writing";
            childEl.setAttribute("entry-type", "writing");
            childEl.setAttribute("img", `corkboard/writing_thumb.png`);
        }
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