let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;

let msnry;

window.addEventListener("DOMContentLoaded", function() {   
    window.scrollTo(0, 0);

    DETAILS_DIALOG_EL = document.getElementById("corkboard-item-dialog");
    // A11yDialog handles toggling accessibility properties when the dialog shows/ hides,
    // as well as closing on esc, clicking outside of the dialog, etc.
    DETAILS_DIALOG_A11Y = new A11yDialog(document.getElementById("corkboard-overlay"));
    DETAILS_DIALOG_A11Y.on('hide', function (event) {
        const dummyItem = document.getElementById("corkboard-item-dummy");
        setTimeout(() => {
            DETAILS_DIALOG_EL.querySelector(".details-dialog-text .date").innerHTML = "";
            DETAILS_DIALOG_EL.querySelector(".details-dialog-inner").innerHTML = "";
            DETAILS_DIALOG_EL.querySelector(".details-dialog-text .credit").innerHTML = "";
            DETAILS_DIALOG_EL.parentNode.classList.remove("sparkle-in");
            DETAILS_DIALOG_EL.classList.remove("slide-out");

            dummyItem.parentElement.classList.remove("memory-writing", "memory-art", "memory-art-writing", "food");
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

        setupEntries(this, CORKBOARD_DATA)
        
        msnry = new Masonry(this, {
            // options
            itemSelector: '.corkboard-item',
            columnWidth: 200,
            initLayout: false,
            horizontalOrder: true,
            fitWidth: true,
            gutter: 10,
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
        // imagesLoaded(this).on("progress", function (instance, image) {
        //     msnry.layout();
        // });
    }

    disconnectedCallback() {
        this.observer.disconnect();
    }
}
class CorkboardItem extends HTMLElement {
    constructor(data) {
      // Always call super first in constructor
      super();

      this.data = data;
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
        this.imageThumb.src = `image-resize/50/${imgUrl}`;
        this.imageThumb.srcset = [
            `image-resize/200/${imgUrl}    200w`,
            `image-resize/400/${imgUrl}    400w`,
        ].join(",");
        this.imageThumb.sizes = [
            "(max-width: 450px) 200px",
            "(max-width: 850px) 400px",
            "400px"
        ].join(",");
        if (this.data.imageRatio) {
            this.imageThumb.style.setProperty('aspect-ratio', this.data.imageRatio.toFixed(2) || 1);
        }
        // this.appendChild(this.imageThumb);
        if (this.getAttribute("entry-type") == "writing") {
            this.imageThumb.onload = function () {
                msnry.layout();
            }
            this.appendChild(this.imageThumb);
        }
        else if (this.getAttribute("polaroid-path")) {
            let polaroidPath = this.getAttribute("polaroid-path");
            this.polaroid = document.createElement("img");
            this.polaroid.classList.add("polaroid");
            this.polaroid.src = `image-resize/50/${polaroidPath}`
            this.polaroid.srcset = [
                `image-resize/200/${polaroidPath}    200w`,
                `image-resize/400/${polaroidPath}    400w`,
            ].join(",");
            this.polaroid.sizes = [
                "(max-width: 450px) 200px",
                "(max-width: 850px) 400px",
                "400px"
            ].join(",");
            this.polaroid.style.setProperty("background-image", `url("/image-resize/400/${imgUrl}")`);
            if (this.data.polaroidRatio) {
                this.polaroid.style.setProperty('aspect-ratio', this.data.polaroidRatio.toFixed(2) || 1);
            }
            this.polaroid.onload = function () {
                msnry.layout();
            }
            this.appendChild(this.polaroid);
        }
        // msnry.appended(this);
        // this.appendChild(this.image);
        this.onmouseover = this.preloadImage;
        this.onclick = this.handleClick.bind(this);
    }

    preloadImage () {
        if (this.preloaded === undefined && !this.type.includes("writing")) {
            this.preloaded = new Image();
            this.preloaded.src = `image-resize/256/${this.getAttribute("img")}`;
        }
    }

    handleClick (e) {
        // setup dummy image
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
        if (this.type !== "memory-writing") {
            if (this.preloaded) {
                image = this.preloaded;
            }
            else {
                image = document.createElement("img");
                image.src = `image-resize/512/${this.getAttribute("img")}`;
                image.alt = this.data.desc;
            }
            dummyItem.appendChild(image);
            if (image.complete) {
                this.onDialogImageLoaded(image, dummyItem);
            }
            else {
                image.addEventListener('load', this.onDialogImageLoaded.bind(this, image, dummyItem), { once: true })
            }
        }
        else {
            this.onDialogImageLoaded();
        }

        if (this.type.includes("writing")) {
            DETAILS_DIALOG_EL.classList.add("writing-only");
        }

        if (this.type == "food") {
            DETAILS_DIALOG_EL.style.display = "none";
            document.getElementById("sparkle-effects").style.display = "";
            let credit1 = document.createElement("span");
            let credit2 = document.createElement("span");
            credit1.classList.add("credit", "label");
            credit2.classList.add("credit");
            if (this.data.type.includes("photo")) {
                credit1.innerHTML = "Photo by:";
            }
            if (this.data.type.includes("art")) {
                credit1.innerHTML = "Art by:";
            }
            credit2.innerHTML = this.data.credit[0];
            document.getElementById("corkboard-item-dummy").append(credit1);
            document.getElementById("corkboard-item-dummy").append(credit2);

            let title = document.createElement("span");
            title.classList.add("title");
            title.innerHTML = this.data.title;
            document.getElementById("corkboard-item-dummy").append(title);
        }
        else {
            DETAILS_DIALOG_EL.style.display = "";
            document.getElementById("sparkle-effects").style.display = "none";
        }

        if (this.data.stream) {
            DETAILS_DIALOG_EL.querySelector(".details-dialog-text .date").innerHTML = `${new Date(this.data.stream.date).toLocaleDateString(undefined, {year: "numeric", month: "numeric", day: "numeric"})} - <a href="${this.data.stream.link}" target="_blank">${this.data.stream.name}</a>`;
            DETAILS_DIALOG_EL.querySelector(".details-dialog-inner").innerHTML = this.data.stream.entry;
            DETAILS_DIALOG_EL.querySelector(".details-dialog-text .credit").innerHTML = this.data.credit[0];
            if (this.type.includes("art")) {
                let artistCredit = this.data.credit[1] || this.data.credit[0];
                let credit1 = document.createElement("span");
                let credit2 = document.createElement("span");
                credit1.classList.add("credit", "label");
                credit2.classList.add("credit");
                if (this.data.type.includes("photo")) {
                    credit1.innerHTML = "Photo by:";
                }
                if (this.data.type.includes("art")) {
                    credit1.innerHTML = "Art by:";
                }
                credit2.innerHTML = artistCredit;
                document.getElementById("corkboard-item-dummy").append(credit1);
                document.getElementById("corkboard-item-dummy").append(credit2);
            }
            if (this.type == "memory-art") {
                let streamDate = document.createElement("span");
                streamDate.classList.add("date");
                streamDate.innerHTML = `${new Date(this.data.stream.date).toLocaleDateString(undefined, {year: "numeric", month: "numeric", day: "numeric"})} - <a href="${this.data.stream.link}" target="_blank">${this.data.stream.name}</a>`;
                document.getElementById("corkboard-item-dummy").append(streamDate);
            }
            // if (!(this.type.includes("writing") && this.type.includes("art"))) {
            //     let yt = document.createElement("iframe");
            //     yt.src = `http://www.youtube.com/embed/${getId(this.data.stream.link)}`;
            //     document.getElementById("corkboard-item-dummy").append(yt);
            // }
        }
        else if (this.data.desc) {
            DETAILS_DIALOG_EL.querySelector(".details-dialog-inner").innerHTML = `<p>${this.data.desc}</p>`;
        }
        if (this.data.cutouts) {
            let dummyEl = document.getElementById("corkboard-item-dummy");
            this.data.cutouts.forEach((cutoutKey, i) => {
                let cutout = document.createElement("img");
                cutout.classList.add("cutout", `cutout_${i}`);
                let cutoutPath = `image-resize/256/corkboard/cutouts/${cutoutKey.toLowerCase()}_cutout.png`
                cutout.src = cutoutPath;
                dummyEl.append(cutout);
            })
        }
        DETAILS_DIALOG_A11Y.show();
    }

    onDialogImageLoaded (image, dummyItem) {
        if (image) {
            image.src = `image-resize/2048/${this.getAttribute("img")}`;
        }
        setTimeout(() => {
            if (dummyItem) {
                dummyItem.classList.add("img-load");
                if (this.type == "food" || this.type == "memory-art") {
                    dummyItem.style.setProperty('--width', (vh(80) * this.data.imageRatio) + "px");
                }
                else {
                    dummyItem.style.setProperty('--width', (vh(65) * this.data.imageRatio) + "px");
                    dummyItem.style.setProperty('height', "50vh");                        
                }
                dummyItem.style.removeProperty("width");
                dummyItem.style.removeProperty("transition");
                dummyItem.style.removeProperty("height");
                dummyItem.style.removeProperty("transform");
                dummyItem.style.removeProperty("rotate");
             }

        }, 500);
        
        setTimeout(() => {
            if (this.type.includes("writing")) {
                DETAILS_DIALOG_EL.classList.add("slide-out");
            }
            else if (this.type.includes("memory") && this.type.includes("art")) {
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
    });
}

function setupEntries (elem, entryData) {
    entryData.forEach((data, i) => {
        if (data.itemType === "inline-deco") {
            makeInlineDeco(elem, data);
        }
        else {
            let childEl = new CorkboardItem(data);
            if (data.type.includes("writing")) childEl.type = "writing";
            if (data.category == "cafe") childEl.type = "food";
            if (data.category == "memory") childEl.type = `memory-${data.type.join("-")}`;
            childEl.setAttribute("idx", i);
            if (data.path) {
                childEl.setAttribute("img", data.path);
            }
            else if (childEl.type == "memory-writing") {
                childEl.setAttribute("img", `corkboard/writing_thumb.png`);
            }
            childEl.setAttribute("entry-type", data.type.join(" "));
            if (data.polaroid.toLowerCase().includes(".png") || data.polaroid.toLowerCase().includes(".jpg")) {
                childEl.setAttribute("polaroid-path", `corkboard-img/entries/${data.polaroid}`);
            }
            else if (data.polaroid) {
                childEl.setAttribute("polaroid-path", `corkboard/polaroids/${data.polaroid}.png`);
            }
            
            childEl.style = `--angle: ${getRandomInt(-5, 5)}deg;`;
            childEl.style.rotate = `${data.rotate}deg`
            childEl.style.zIndex = `${data.zIndex}`;
            elem.append(childEl);
            elem.observer.observe(childEl);
        }
    })
}

function makeInlineDeco (elem, data) {
    let decoEl = document.createElement("img");
    decoEl.classList.add("corkboard-item", "inline-deco")
    decoEl.src = `/image-resize/full/${data.path}`;
    if (data.imageRatio) {
        decoEl.style.setProperty('aspect-ratio', data.imageRatio.toFixed(2));
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

function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|live\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}