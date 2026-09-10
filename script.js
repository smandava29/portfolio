const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#navigation');

document.querySelector('#year').textContent = new Date().getFullYear();

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

document.querySelectorAll('[data-scroll-top]').forEach((element) => {
  element.addEventListener('click', scrollToTop);
});

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 12);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Menu';
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
}));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}
