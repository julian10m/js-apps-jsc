'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const allSections = document.querySelectorAll('.section');
const section1 = document.querySelector('#section--1');
const tabsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const lazyLoadedImgs = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const sliderBtnLeft = document.querySelector('.slider__btn--left');
const sliderBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

const changeTab = function (event) {
  const clickedButton = event.target.closest('.operations__tab');
  if (clickedButton) {
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
    tabsContent.forEach(tab =>
      tab.classList.remove('operations__content--active')
    );
    clickedButton.classList.add('operations__tab--active');
    document
      .querySelector(`.operations__content--${clickedButton.dataset.tab}`)
      .classList.add('operations__content--active');
  }
};

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

const modalHandler = function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
};

const scrollToSections = function (event) {
  event.preventDefault();
  if (
    event.target.classList.contains('nav__link') &&
    !event.target.classList.contains('nav__link--btn')
  ) {
    document
      .querySelector(event.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
};

const handleNavHover = function (event) {
  event.preventDefault();
  const selectedLink = event.target;
  if (selectedLink.classList.contains('nav__link')) {
    nav.querySelectorAll('.nav__link').forEach(l => {
      if (l !== selectedLink) l.style.opacity = this;
    });
    nav.querySelector('img').style.opacity = this;
  }
};

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const loadImgs = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', function () {
      this.classList.remove('lazy-img');
    });
    observer.unobserve(entry.target);
  }
};

const setSlide = function (slideIdx) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideIdx)}%)`;
  });
};

const rotateSlider = function (delta) {
  currentSlide += delta;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  else currentSlide = currentSlide % slides.length;
  setSlideAndDot(currentSlide);
};

const nextSlide = function () {
  rotateSlider(1);
};

const previousSlide = function () {
  rotateSlider(-1);
};

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};

const activateDot = function (slideIdx) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(d => d.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slideIdx}"]`)
    .classList.add('dots__dot--active');
};

const setSlideAndDot = function (slideIdx) {
  setSlide(slideIdx);
  activateDot(slideIdx);
};

const handleDotClick = function (event) {
  if (event.target.classList.contains('dots__dot')) {
    setSlideAndDot(event.target.dataset.slide);
  }
};

let currentSlide = 0;
createDots();
setSlideAndDot(currentSlide);

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
document.addEventListener('keydown', modalHandler);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
btnScrollTo.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' })
);
document
  .querySelector('.nav__links')
  .addEventListener('click', scrollToSections);
tabsContainer.addEventListener('click', changeTab);

nav.addEventListener('mouseover', handleNavHover.bind(0.5));
nav.addEventListener('mouseout', handleNavHover.bind(1));

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${nav.getBoundingClientRect().height}px`,
});
headerObserver.observe(header);

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  //   section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

const imgsObserver = new IntersectionObserver(loadImgs, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
lazyLoadedImgs.forEach(img => imgsObserver.observe(img));

sliderBtnLeft.addEventListener('click', previousSlide);
sliderBtnRight.addEventListener('click', nextSlide);

document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', handleDotClick);
