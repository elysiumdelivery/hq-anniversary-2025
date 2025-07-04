window.addEventListener("load", function() {   
    let sections = document.querySelectorAll(".scroll-vis");
    
    const options = {
        rootMargin: "0px",
        threshold: 0.25,
    };
    
    const observer = new IntersectionObserver(scrollIntersectionCallback, options);
    sections.forEach((section) => {
        section.childNodes.forEach((node, i) => {
            if (node.nodeType === node.ELEMENT_NODE) {
                observer.observe(node);
            }
        })
    });
});

function scrollIntersectionCallback (entries, observer) {
    entries.forEach((entry) => {
        let elem = entry.target;
        if (entry.isIntersecting) {
            elem.classList.add("visible");
        }
    });
}