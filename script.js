const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#navigation');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('#year').textContent = new Date().getFullYear();

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

document.querySelectorAll('[data-scroll-top]').forEach((element) => {
  element.addEventListener('click', scrollToTop);
});

function updateHeader() {
  header.classList.toggle('scrolled', window.scrollY > 12);
}

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
}

menuToggle.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Menu';
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const lensTabs = [...document.querySelectorAll('[data-lens]')];
const lensPanels = [...document.querySelectorAll('.lens-panel')];

function selectLens(tab, moveFocus = false) {
  lensTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  lensPanels.forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute('aria-controls');
  });
  if (moveFocus) tab.focus();
}

lensTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectLens(tab));
  tab.addEventListener('keydown', (event) => {
    const directions = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (event.key === 'Home' || event.key === 'End' || directions[event.key]) {
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? lensTabs.length - 1 : (index + directions[event.key] + lensTabs.length) % lensTabs.length;
      selectLens(lensTabs[nextIndex], true);
    }
  });
});

const navLinks = [...navigation.querySelectorAll('a')];
const navSections = navLinks.map((link) => document.querySelector(link.hash)).filter(Boolean);
const activeNavigation = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
  if (!visible) return;
  navLinks.forEach((link) => link.setAttribute('aria-current', String(link.hash === `#${visible.target.id}`)));
}, { rootMargin: '-30% 0px -55%', threshold: 0 });

navSections.forEach((section) => activeNavigation.observe(section));

if (!reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
}
