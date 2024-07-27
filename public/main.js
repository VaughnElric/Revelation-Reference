// book.js

import content from "./content.js";

const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const numOfPapers = 74;
const papers = [];

for (let i = 1; i <= numOfPapers; i++) {
    const paper = document.createElement('div');
    paper.id = `p${i}`;
    paper.classList.add('paper');

    const front = document.createElement('div');
    front.classList.add('front');

    const frontContent = document.createElement('div');
    frontContent.classList.add('front-content');
    front.appendChild(frontContent);

    const back = document.createElement('div');
    back.classList.add('back');

    const backContent = document.createElement('div');
    backContent.classList.add('back-content');
    back.appendChild(backContent);

    paper.appendChild(front);
    paper.appendChild(back);
    book.appendChild(paper);

    papers.push(paper);
}

let currentLocation = 1;
const maxLocation = numOfPapers + 1;

prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

function openBook() {
    book.style.transform = "translateX(50%)";
    prevBtn.style.transform = "translateX(-180px)";
    nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isAtBeginning) {
    book.style.transform = isAtBeginning ? "translateX(0%)" : "translateX(100%)";
    prevBtn.style.transform = "translateX(0px)";
    nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        if (currentLocation === 1) {
            openBook();
        } else if (currentLocation === maxLocation - 1) {
            closeBook(false);
        }

        const paper = papers[currentLocation - 1];
        paper.classList.add("flipped");
        paper.style.zIndex = currentLocation;
        currentLocation++;

        // Play animation if image is visible
        const currentPage = papers[currentLocation - 1];
        const frontImgElement = currentPage.querySelector('.front-content img');
        const backImgElement = currentPage.querySelector('.back-content img');
        if (frontImgElement) {
            const frontCanvas = frontImgElement.nextSibling;
            startParticleEffect(frontCanvas); // Start the particle effect
        }
        if (backImgElement) {
            const backCanvas = backImgElement.nextSibling;
            startParticleEffect(backCanvas); // Start the particle effect
        }
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        if (currentLocation === maxLocation) {
            openBook();
        } else if (currentLocation === 2) {
            closeBook(true);
        }

        const paper = papers[currentLocation - 2];
        paper.classList.remove("flipped");
        paper.style.zIndex = maxLocation - currentLocation + 1;
        currentLocation--;

        // Play animation if image is visible
        const currentPage = papers[currentLocation - 1];
        const frontImgElement = currentPage.querySelector('.front-content img');
        const backImgElement = currentPage.querySelector('.back-content img');
        if (frontImgElement) {
            const frontCanvas = frontImgElement.nextSibling;
            startParticleEffect(frontCanvas); // Start the particle effect
        }
        if (backImgElement) {
            const backCanvas = backImgElement.nextSibling;
            startParticleEffect(backCanvas); // Start the particle effect
        }
    }
}

// Set the initial z-index for all papers except Front 1
for (let i = 0; i < papers.length; i++) {
    papers[i].style.zIndex = numOfPapers - i; // Adjust z-index calculation
}

// Function to insert content (including images) into the pages of the book
function insertContentIntoPages() {
    const pages = book.querySelectorAll('.paper');

    // Iterate through each page
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const pageContentIndex = i * 2; // Adjusted content index for this page
        const frontContent = page.querySelector('.front-content');
        const backContent = page.querySelector('.back-content');

        // Insert text content into front
        frontContent.innerHTML = `<h1>${content[pageContentIndex].title}</h1>`;
        frontContent.innerHTML += content[pageContentIndex].text;

        // Insert images (if any) into front
        if (content[pageContentIndex].images) {
            for (let j = 0; j < content[pageContentIndex].images.length; j++) {
                const image = content[pageContentIndex].images[j];
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;

                // Apply custom size if specified
                if (image.size) {
                    imgElement.style.width = image.size.width;
                    imgElement.style.height = image.size.height;
                }

                frontContent.appendChild(imgElement);
                createCanvasForImage(imgElement, image.size); // Apply particle effect to the image
            }
        }

        // If there is content for the back, insert it
        if (content[pageContentIndex + 1]) {
            backContent.innerHTML = `<h1>${content[pageContentIndex + 1].title}</h1>`;
            backContent.innerHTML += content[pageContentIndex + 1].text;

            // Insert images (if any) into back
            if (content[pageContentIndex + 1].images) {
                for (let j = 0; j < content[pageContentIndex + 1].images.length; j++) {
                    const image = content[pageContentIndex + 1].images[j];
                    const imgElement = document.createElement('img');
                    imgElement.src = image.src;
                    imgElement.alt = image.alt;

                    // Apply custom size if specified
                    if (image.size) {
                        imgElement.style.width = image.size.width;
                        imgElement.style.height = image.size.height;
                    }

                    backContent.appendChild(imgElement);
                    createCanvasForImage(imgElement, image.size); // Apply particle effect to the image
                }
            }
        }
    }

    // Handle the last page and back cover specifically
    const lastPage = pages[pages.length - 1];
    const lastPageBackContent = lastPage.querySelector('.back-content');

    // Ensure the last image on the back cover is not duplicated
    if (content[content.length - 1] && content[content.length - 1].images) {
        for (let j = 0; j < content[content.length - 1].images.length; j++) {
            const image = content[content.length - 1].images[j];
            const existingImgElements = lastPageBackContent.querySelectorAll('img[src="' + image.src + '"]');
            if (existingImgElements.length === 0) { // Only add if not already present
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;

                // Apply custom size if specified
                if (image.size) {
                    imgElement.style.width = image.size.width;
                    imgElement.style.height = image.size.height;
                }

                lastPageBackContent.appendChild(imgElement);
                createCanvasForImage(imgElement, image.size); // Apply particle effect to the image
            }
        }
    }
}

// Function to create canvas for an image and apply particle effect
function createCanvasForImage(imgElement, imageSize) {
    // Ensure the image is fully loaded
    imgElement.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = parseInt(imageSize.width);
        canvas.height = parseInt(imageSize.height);
        canvas.style.position = 'absolute';
        canvas.style.top = imgElement.offsetTop + 'px';
        canvas.style.left = imgElement.offsetLeft + 'px';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '2'; // Ensure canvas is above the image

        // Create the layer canvas
        const layerCanvas = document.createElement('canvas');
        const layerCtx = layerCanvas.getContext('2d');
        layerCanvas.width = parseInt(imageSize.width);
        layerCanvas.height = parseInt(imageSize.height);
        layerCanvas.style.position = 'absolute';
        layerCanvas.style.top = imgElement.offsetTop + 'px';
        layerCanvas.style.left = imgElement.offsetLeft + 'px';
        layerCanvas.style.pointerEvents = 'none';
        layerCanvas.style.zIndex = '3'; // Ensure layer is above the canvas

        // Fill the layer canvas with the page color
        layerCtx.fillStyle = 'rgb(224, 202, 173)'; // Page background color
        layerCtx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);

        // Insert canvases after the image
        if (imgElement.parentNode) {
            imgElement.parentNode.insertBefore(canvas, imgElement.nextSibling);
            imgElement.parentNode.insertBefore(layerCanvas, canvas.nextSibling);
            applyParticleEffect(canvas, layerCanvas, imgElement); // Start the particle effect
        }
    };
}


const activeAnimations = new Map();

// Function for particle effect to reveal the image as the particle progresses
function applyParticleEffect(canvas, layerCanvas, imgElement) {
    const ctx = canvas.getContext('2d');
    const layerCtx = layerCanvas.getContext('2d');
    let particles = []; // Array to hold particle objects
    let animationId; // Store the requestAnimationFrame ID

    // Draw the image on the canvas
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Function to initialize particles
    function initParticles() {
        particles = [];
        const numberOfParticles = 50; // Number of particles to create
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    // Function to animate particles
    function animateParticles() {
        layerCtx.globalCompositeOperation = 'source-over';
        layerCtx.fillStyle = 'rgba(224, 202, 173, 0.1)'; // Regenerate layer opacity
        layerCtx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);

        particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });

        animationId = requestAnimationFrame(animateParticles);
        activeAnimations.set(canvas, animationId);
    }

    // Particle class definition
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 10;
            this.speed = Math.random() * 5 + 15;
            this.opacity = 1; // Start with full opacity
            this.opacityDecrement = Math.random() * 0.02 + 0.005; // Random opacity decrement rate
            this.trailLength = Math.floor(Math.random() * 10) + 5;
        }

        update() {
            this.opacity -= this.opacityDecrement;
            if (this.opacity < 0) {
                this.opacity = 0;
            }
            this.y -= this.speed;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
                this.opacity = 1; // Reset opacity when particle wraps around
            }
        }

        draw() {
            for (let i = 0; i < this.trailLength; i++) {
                const trailX = Math.floor(this.x);
                const trailY = Math.floor(this.y - i * this.size);
                if (trailY < 0 || trailY >= canvas.height || trailX < 0 || trailX >= canvas.width) continue;
                layerCtx.globalCompositeOperation = 'destination-out';
                layerCtx.globalAlpha = this.opacity * (1 - i / this.trailLength);
                layerCtx.fillRect(trailX, trailY, this.size, this.size);
            }
        }
    }

    // Initialize particles and start animation
    initParticles();
    animateParticles();
}

function startParticleEffect(canvas) {
    if (!activeAnimations.has(canvas)) {
        const imgElement = canvas.previousElementSibling;
        const layerCanvas = canvas.nextSibling;
        applyParticleEffect(canvas, layerCanvas, imgElement);
    }
}

function stopParticleEffect(canvas) {
    if (activeAnimations.has(canvas)) {
        cancelAnimationFrame(activeAnimations.get(canvas));
        activeAnimations.delete(canvas);
    }
}

// Intersection Observer to detect canvas visibility
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver(onIntersection, observerOptions);

const canvases = document.querySelectorAll('canvas');
canvases.forEach(canvas => {
    observer.observe(canvas);
});

function onIntersection(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startParticleEffect(entry.target);
        } else {
            stopParticleEffect(entry.target);
        }
    });
}

// Insert the content into the pages of the book
insertContentIntoPages();
