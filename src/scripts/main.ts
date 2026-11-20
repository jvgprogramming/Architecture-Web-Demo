import { initAnchors, onScroll, scrollToTarget } from './smooth';
import { initHeader, initMobileMenu } from './header';
import { initHero } from './hero';
import { initCounters, initMagnetic, initReveals } from './reveal';
import { initProcess } from './process';
import { initWork } from './work';
import { initTestimonials } from './testimonials';
import { initContactForm } from './contact';

// Tell the fail-safe in Layout.astro that the motion system is running.
document.documentElement.classList.add('motion-ready');

initAnchors();
initHeader();
initMobileMenu();
initHero();
initReveals();
initCounters();
initMagnetic();
initProcess();
initWork();
initTestimonials();
initContactForm();
initBackToTop();

function initBackToTop() {
	const btn = document.querySelector<HTMLButtonElement>('[data-to-top]');
	if (!btn) return;

	const footer = document.querySelector('[data-reveal-scope]');
	onScroll((y) => {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		btn.classList.toggle('is-visible', y > window.innerHeight * 0.9);
		// Step aside while the footer (which has its own back-to-top) is showing
		if (footer) document.documentElement.classList.toggle('footer-in-view', footer.getBoundingClientRect().top < window.innerHeight * 0.85);
		btn.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
	});

	btn.addEventListener('click', () => {
		scrollToTarget(0);
		history.replaceState(null, '', location.pathname);
		document.querySelector<HTMLElement>('.wordmark')?.focus({ preventScroll: true });
	});
}
