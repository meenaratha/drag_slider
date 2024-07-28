const carousel = document.querySelector(".carousel"),
firstImg = carousel.querySelectorAll("img")[0],
arrowIcons = document.querySelectorAll(".wrapper i"),
dotsContainer = document.querySelector(".dots");

let isDragStart = false, isDragging = false, prevPageX, prevScrollLeft, positionDiff, autoPlayInterval;

const updateDots = () => {
  const totalImages = carousel.querySelectorAll("img").length;
  dotsContainer.innerHTML = ""; // Clear existing dots
  for (let i = 0; i < totalImages; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active"); // Make the first dot active by default
    dot.addEventListener("click", () => {
      carousel.scrollLeft = i * (firstImg.clientWidth + 14);
      updateActiveDot();
    });
    dotsContainer.appendChild(dot);
  }
};

const updateActiveDot = () => {
  const dots = dotsContainer.querySelectorAll(".dot");
  const activeIndex = Math.round(carousel.scrollLeft / (firstImg.clientWidth + 14));
  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
};

const showHideIcons = () => {
  let scrollWidth = carousel.scrollWidth - carousel.clientWidth;
  arrowIcons[0].style.display = carousel.scrollLeft == 0 ? "none" : "block";
  arrowIcons[1].style.display = carousel.scrollLeft == scrollWidth ? "none" : "block";
};

arrowIcons.forEach(icon => {
  icon.addEventListener("click", () => {
    let firstImgWidth = firstImg.clientWidth + 14;
    carousel.scrollLeft += icon.id == "left" ? -firstImgWidth : firstImgWidth;
    setTimeout(() => {
      showHideIcons();
      updateActiveDot();
    }, 60);
  });
});

const autoSlide = () => {
  if (carousel.scrollLeft - (carousel.scrollWidth - carousel.clientWidth) > -1 || carousel.scrollLeft <= 0) return;

  positionDiff = Math.abs(positionDiff);
  let firstImgWidth = firstImg.clientWidth + 14;
  let valDifference = firstImgWidth - positionDiff;

  if (carousel.scrollLeft > prevScrollLeft) {
    carousel.scrollLeft += positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
  } else {
    carousel.scrollLeft -= positionDiff > firstImgWidth / 3 ? valDifference : -positionDiff;
  }
  updateActiveDot();
};

const dragStart = (e) => {
  isDragStart = true;
  prevPageX = e.pageX || e.touches[0].pageX;
  prevScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragStart) return;
  e.preventDefault();
  isDragging = true;
  carousel.classList.add("dragging");
  positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
  carousel.scrollLeft = prevScrollLeft - positionDiff;
  showHideIcons();
};

const dragStop = () => {
  isDragStart = false;
  carousel.classList.remove("dragging");
  if (!isDragging) return;
  isDragging = false;
  autoSlide();
};

const autoPlay = () => {
  autoPlayInterval = setInterval(() => {
    let firstImgWidth = firstImg.clientWidth + 14;
    carousel.scrollLeft += firstImgWidth;
    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
      carousel.scrollLeft = 0;
    }
    updateActiveDot();
    showHideIcons();
  }, 3000);
};

const stopAutoPlay = () => {
  clearInterval(autoPlayInterval);
};

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("touchstart", dragStart);
document.addEventListener("mousemove", dragging);
carousel.addEventListener("touchmove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("touchend", dragStop);

carousel.addEventListener("mouseenter", stopAutoPlay);
carousel.addEventListener("mouseleave", autoPlay);

updateDots();
showHideIcons();
autoPlay();
