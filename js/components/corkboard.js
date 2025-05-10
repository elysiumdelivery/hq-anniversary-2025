let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;

const SETUP = false;

let msnry;
let photos = ["Food1", "Writing1",  "Mem3", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food1", "Writing1",  "Mem3", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food1", "Writing1",  "Mem3", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food1", "Writing1",  "Mem3", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5", "Food5", "Mem1",  "Food3", "Writing1", "Mem5", "Food1", "Mem1",  "Food3", "Writing1", "Mem3", "Food5", "Writing1", "Mem5"]
let singleDecos = ["eds.png", "home/polaroid1.png", "home/polaroid2.png"];
let reusableDecos = ["star1.png", "star2.png"];

const randomData = [];

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
            rootMargin: "100px",
            trackVisibility: true,
            threshold: 0.5,
            delay: 100,
        };
        this.observer = new IntersectionObserver(scrollIntersectionCallback, options);

        if (SETUP) {
            genEntries();
            setupEntries(this, randomData);
        }
        else {
            setupEntries(this, CORKBOARD_DATA)
        }

        
        msnry = new Masonry(this, {
            // options
            itemSelector: '.corkboard-item',
            columnWidth: 200,
            initLayout: false,
            horizontalOrder: true,
            fitWidth: true,
            gutter: 50,
            stagger: 50,
            transitionDuration: 0
        });
        msnry.on('layoutComplete', function(laidOutItems) {
            laidOutItems.forEach((entry, i) => {
                let elem = entry.element;
                if (elem.classList.contains("inline-deco") && !(elem.classList.contains("visible"))) {
                    elem.classList.add("visible");
                }
                else if (!(elem.classList.contains("visible"))) {
                    elem.onanimationend = (event) => {
                        if (event.animationName == "corkboard-item-anim-in") {
                            elem.classList.add("visible");
                            elem.classList.remove("anim-in");
                        }
                    }
                    if (elem.imageThumb.complete) {
                        elem.classList.add("anim-in");
                    }
                }
                // msnry.off("layoutComplete");
            });
        });
        imagesLoaded(this).on("progress", function (instance, image) {
            msnry.layout();
        });
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
        this.classList.add("corkboard-item");
        this.role = "listitem";
        let imgUrl;
        if (this.hasAttribute("img")) {
          imgUrl = this.getAttribute("img");
        } else {
          imgUrl = "images/default.png";
        }

        this.imageThumb = document.createElement("img");
        // this.imageThumb.loading = "lazy";
        if (SETUP) {
            this.imageThumb.addEventListener("load", function (e) {
                let ratio = e.target.naturalWidth / e.target.naturalHeight;
                this.style.setProperty('aspect-ratio', ratio.toFixed(2));
                // this.classList.add("anim-in");
                let idx = Array.from(this.parentNode.children).indexOf(this);
                randomData[idx].ratio = ratio;
                // setTimeout(function () { msnry.appended(this); }.bind(this), 500);
            }.bind(this))
        }
        // this.image = document.createElement("img");
        if (this.getAttribute("entry-type") === "art") {
            this.imageThumb.src = `image-resize/50/corkboard-img/${this.getAttribute("photo-key")}.png`;
            this.imageThumb.srcset = [
                `image-resize/200/corkboard-img/${this.getAttribute("photo-key")}.png    200w`,
                `image-resize/400/corkboard-img/${this.getAttribute("photo-key")}.png    400w`,
            ].join(",");
            this.imageThumb.sizes = [
                "(max-width: 450px) 200px",
                "(max-width: 850px) 400px",
                "400px"
            ].join(",");
        }
        else {
            this.imageThumb.src = `image-resize/50/corkboard/writing_thumb.png`;
            this.imageThumb.srcset = [
                `image-resize/200/corkboard/writing_thumb.png    200w`,
                `image-resize/400/corkboard/writing_thumb.png    400w`,
            ].join(",");
            this.imageThumb.sizes = [
                "(max-width: 450px) 200px",
                "(max-width: 850px) 400px",
                "400px"
            ].join(",");
        }
        this.appendChild(this.imageThumb);
        // msnry.appended(this);
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
            if (dummyItem) {
                dummyItem.style = "";
                dummyItem.classList.add("img-load");
                if (this.type == "food") {
                    let ratio = image.naturalWidth / image.naturalHeight;
                    dummyItem.style.setProperty('--width', (vh(80) * ratio) + "px");
                }
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
        elem.style.setProperty("content-visibility", entry.isIntersecting ? "visible" : "hidden");
        observer.unobserve(entry.target);
        // if (entry.isIntersecting && !(elem.classList.contains("visible"))) {

            // elem.onanimationend = (event) => {
            //     if (event.animationName == "corkboard-item-anim-in") {
            //         elem.classList.add("visible");
            //         elem.classList.remove("anim-in");
            //     }
            // }
            // // if (elem.getAttribute("entry-type") === "art") {
            // //     elem.imageThumb.src = `image-resize/50/corkboard-img/${elem.getAttribute("photo-key")}.png`;
            // //     elem.imageThumb.srcset = [
            // //         `image-resize/200/corkboard-img/${elem.getAttribute("photo-key")}.png    200w`,
            // //         `image-resize/400/corkboard-img/${elem.getAttribute("photo-key")}.png    400w`,
            // //     ].join(",");
            // //     elem.imageThumb.sizes = [
            // //         "(max-width: 450px) 200px",
            // //         "(max-width: 850px) 400px",
            // //         "400px"
            // //     ].join(",");
            // // }
            // // else {
            // //     elem.imageThumb.src = `image-resize/50/corkboard/writing_thumb.png`;
            // //     elem.imageThumb.srcset = [
            // //         `image-resize/200/corkboard/writing_thumb.png    200w`,
            // //         `image-resize/400/corkboard/writing_thumb.png    400w`,
            // //     ].join(",");
            // //     elem.imageThumb.sizes = [
            // //         "(max-width: 450px) 200px",
            // //         "(max-width: 850px) 400px",
            // //         "400px"
            // //     ].join(",");
            // // }
            // if (elem.imageThumb.complete) {
            //     elem.classList.add("anim-in");
            // }
        // }
    });
}

function genEntries () {
    let plusOrMinus = 1;
    let pmCount = 0;
    for (var i = 0; i < photos.length; i++) {
        if (i % 6 === 0) {
            genInlineDeco(singleDecos, { rotate: true });
        }
        else if (i % 3 === 0) {
            genInlineDeco(reusableDecos, { margin: true });
        }
        let photoKey = photos[i];
        var newPlusOrMinus = Math.random() < 0.5 ? -1 : 1;
        if (plusOrMinus === newPlusOrMinus && pmCount < 2) {
            pmCount++;
        }
        else if (plusOrMinus === newPlusOrMinus) {
            newPlusOrMinus = newPlusOrMinus * -1;
            pmCount = 0;
        }
        plusOrMinus = newPlusOrMinus;

        let data = {
            type: "corkboard-item",
            photoKey: photoKey,
            path: `corkboard-img/${photoKey}.png`,
            rotate: Math.round((2 + Math.random() * 5 * plusOrMinus)),
            zIndex: 100 + photos.length - i
        }
        if (photoKey.includes("Food")) data.type = "food";
        if (photoKey.includes("Mem")) data.type = "memory";
        if (photoKey.includes("Writing")) {
            data.type = "writing";
        }
        randomData.push(data);
    }
}

function setupEntries (elem, entryData) {
    entryData.forEach((data) => {
        if (data.type === "inline-deco") {
            makeInlineDeco(elem, data);
        }
        else {
            let childEl = new CorkboardItem();
            childEl.type = data.type;
            childEl.setAttribute("img", data.path);
            childEl.setAttribute("photo-key", data.photoKey);
            childEl.setAttribute("entry-type", "art");
            if (data.type == "writing") {
                childEl.setAttribute("entry-type", "writing");
                childEl.setAttribute("img", `corkboard/writing_thumb.png`);
            }
            if (data.ratio) {
                childEl.style.setProperty('aspect-ratio', data.ratio.toFixed(2));
            }
            childEl.style = `--angle: ${getRandomInt(-5, 5)}deg;`;
            childEl.style.rotate = `${data.rotate}deg`
            childEl.style.zIndex = `${data.zIndex}`;
            elem.append(childEl);
            elem.observer.observe(childEl);
        }
    })
}

function genInlineDeco (decos, options) {
    let randomDecoPath = decos[Math.floor(Math.random() * decos.length)];
    let data = {
        type: "inline-deco",
        path: randomDecoPath,
    };
    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    if (options.rotate) {
        data.rotate = Math.round((2 + Math.random() * 5 * plusOrMinus));
    }
    if (options.margin) {
        data.margin = Math.round((2 + Math.random() * 5));
    }
    randomData.push(data);
}
function makeInlineDeco (elem, data) {
    let decoEl = document.createElement("img");
    decoEl.classList.add("corkboard-item", "inline-deco")
    decoEl.src = `/image-resize/full/${data.path}`;
    if (SETUP) {
        decoEl.addEventListener("load", function (e) {
            let ratio = e.target.naturalWidth / e.target.naturalHeight;
            let idx = Array.from(this.parentNode.children).indexOf(this);
            randomData[idx].ratio = ratio;
        }.bind(decoEl))
    }
    if (data.ratio) {
        decoEl.style.setProperty('aspect-ratio', data.ratio.toFixed(2));
    }
    if (data.rotate) {
        decoEl.style.rotate = `${data.rotate}deg`
    }
    if (data.margin) {
        decoEl.style.margin = `1vw ${data.margin}vw`
    }
    elem.append(decoEl);
}

function vh (percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}