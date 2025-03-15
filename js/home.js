window.addEventListener("load", function() {   
    let sections = document.querySelectorAll("section.scroll-vis");
    
    const options = {
        root: document.querySelector("#scrollArea"),
        rootMargin: "0px",
        threshold: 0.25,
    };
    
    const observer = new IntersectionObserver(scrollIntersectionCallback, options);
    sections.forEach((section) => {
        section.childNodes.forEach((node, i) => node.style = `transition-delay: ${i * 0.25}s;`)
        observer.observe(section);
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