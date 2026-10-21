var header = document.querySelector('.site-header');
var menuToggle = document.querySelector('#menu-toggle');
var navigation = document.querySelector('#navigation');
var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var revealElements = document.querySelectorAll('.reveal');
var navLinks = navigation.querySelectorAll('a');
var navSections = [];

document.querySelector('#year').textContent = new Date().getFullYear();

function pageTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

function updateHeader() {
  header.classList.toggle('scrolled', pageTop() > 12);
}

function updateActiveNavigation() {
  var activeSection = null;
  var headerHeight = header.offsetHeight + 80;
  var index;

  for (index = 0; index < navSections.length; index += 1) {
    var bounds = navSections[index].getBoundingClientRect();
    if (bounds.top <= headerHeight && bounds.bottom > headerHeight) activeSection = navSections[index];
  }

  for (index = 0; index < navLinks.length; index += 1) {
    navLinks[index].setAttribute('aria-current', String(activeSection && navLinks[index].getAttribute('href') === '#' + activeSection.id));
  }
}

function revealVisibleContent() {
  var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  var index;

  for (index = 0; index < revealElements.length; index += 1) {
    if (reduceMotion || revealElements[index].getBoundingClientRect().top < viewportHeight * 0.9) {
      revealElements[index].classList.add('visible');
    }
  }
}

function updatePage() {
  updateHeader();
  updateActiveNavigation();
  revealVisibleContent();
}

function closeMenu() {
  navigation.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = 'Menu';
}

function selectWorkTab(button, moveFocus) {
  var workTabs = document.querySelectorAll('[data-work-tab]');
  var workPanels = document.querySelectorAll('.workflow-panel');
  var index;

  for (index = 0; index < workTabs.length; index += 1) {
    var selected = workTabs[index] === button;
    workTabs[index].setAttribute('aria-selected', String(selected));
    workTabs[index].tabIndex = selected ? 0 : -1;
  }

  for (index = 0; index < workPanels.length; index += 1) {
    workPanels[index].hidden = workPanels[index].id !== button.getAttribute('aria-controls');
  }

  if (moveFocus) button.focus();
}

function handleWorkTabKeydown(event) {
  var key = event.key || event.keyCode;
  var workTabs = document.querySelectorAll('[data-work-tab]');
  var current = event.currentTarget;
  var index;

  for (index = 0; index < workTabs.length; index += 1) {
    if (workTabs[index] === current) break;
  }

  if (key === 'Home' || key === 36) index = 0;
  else if (key === 'End' || key === 35) index = workTabs.length - 1;
  else if (key === 'ArrowRight' || key === 'ArrowDown' || key === 39 || key === 40) index = (index + 1) % workTabs.length;
  else if (key === 'ArrowLeft' || key === 'ArrowUp' || key === 37 || key === 38) index = (index + workTabs.length - 1) % workTabs.length;
  else return;

  event.preventDefault();
  selectWorkTab(workTabs[index], true);
}

function toggleExperienceDetail(event) {
  var button = event.currentTarget;
  var expanded = button.getAttribute('aria-expanded') === 'true';
  var detail = document.getElementById(button.getAttribute('aria-controls'));

  button.setAttribute('aria-expanded', String(!expanded));
  detail.hidden = expanded;
  button.parentNode.classList.toggle('is-open', !expanded);
}

var index;
for (index = 0; index < document.querySelectorAll('[data-scroll-top]').length; index += 1) {
  document.querySelectorAll('[data-scroll-top]')[index].addEventListener('click', scrollToTop);
}

for (index = 0; index < navLinks.length; index += 1) {
  var section = document.getElementById(navLinks[index].getAttribute('href').slice(1));
  if (section) navSections.push(section);
  navLinks[index].addEventListener('click', closeMenu);
}

menuToggle.addEventListener('click', function () {
  var open = navigation.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? 'Close' : 'Menu';
});

var workTabs = document.querySelectorAll('[data-work-tab]');
for (index = 0; index < workTabs.length; index += 1) {
  workTabs[index].addEventListener('click', function (event) {
    selectWorkTab(event.currentTarget, false);
  });
  workTabs[index].addEventListener('keydown', handleWorkTabKeydown);
}

var experienceToggles = document.querySelectorAll('.experience-toggle');
for (index = 0; index < experienceToggles.length; index += 1) {
  experienceToggles[index].addEventListener('click', toggleExperienceDetail);
}

window.addEventListener('scroll', updatePage, false);
window.addEventListener('resize', updatePage, false);
updatePage();
