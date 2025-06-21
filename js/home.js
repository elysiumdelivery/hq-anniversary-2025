let clickableAreas;
let promptIndex = 0;

window.addEventListener("load", function() {   
    let sections = document.querySelectorAll("section.scroll-vis");
    
    const options = {
        root: document.querySelector("#scrollArea"),
        rootMargin: "0px",
        threshold: 0.25,
    };
    
    const observer = new IntersectionObserver(scrollIntersectionCallback, options);
    sections.forEach((section) => {
        let decoCount = 0;
        section.childNodes.forEach((node, i) => {
            if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains("deco")) {
                observer.observe(node)
            }
            else {
                node.ontransitionend = removeStyle;
                node.style = `transition-delay: ${decoCount++ * 0.25}s`
            }
        });
        observer.observe(section);
    });
    clickableAreas = Array.from(document.querySelectorAll("#intro > a"));
    clickableAreas.forEach(function(el) {
        el.addEventListener("animationend", function (event) { this.classList.remove("prompt") });
    })
    setInterval(promptClickableArea.bind(clickableAreas), 5000);
});

function scrollIntersectionCallback (entries, observer) {
    entries.forEach((entry, i) => {
        let elem = entry.target;
        if (entry.isIntersecting) {
            elem.ontransitionend = removeStyle;
            elem.classList.add("visible");
            elem.style = `transition-delay: ${i * 0.25}s`;
            observer.unobserve(elem);
        }
    });
}

function removeStyle (e) {
    e.target.style = "";
    e.target.classList.add("transition-finish");
}

function promptClickableArea () {
    this.forEach(function(el, i) {
        if (i == promptIndex && !el.matches(":hover")) {
            el.classList.add("prompt");
        }
        else {
            el.classList.remove("prompt");
        }
    });
    if (++promptIndex > this.length) {
        promptIndex = 0;
    }
}