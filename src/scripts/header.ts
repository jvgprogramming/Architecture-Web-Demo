import { lockScroll, onScroll, unlockScroll } from './smooth';

export function initHeader() {
	const header = document.querySelector<HTMLElement>('[data-header]');
	if (!header) return;

	const staticSolid = header.hasAttribute('data-static-solid');
	const hero = document.querySelector<HTMLElement>('[data-hero]');
	let lastY = window.scrollY;

	onScroll((y) => {
		const menuOpen = document.documentElement.classList.contains('menu-open');
		const heroEnd = hero ? hero.offsetHeight - 90 : 40;

		if (!staticSolid) header.classList.toggle('is-solid', y > heroEnd);

		const goingDown = y > lastY + 2;
		const goingUp = y < lastY - 2;
		if (!menuOpen && goingDown && y > Math.max(heroEnd, 300)) header.classList.add('is-hidden');
		else if (goingUp || y < 120) header.classList.remove('is-hidden');
		lastY = y;
	});

	header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

	initPillNav();
}

/**
 * The centered pill nav: a single indicator slides to the hovered link,
 * and rests on the link of the section currently in view.
 */
function initPillNav() {
	const nav = document.querySelector<HTMLElement>('[data-pill-nav]');
	const indicator = nav?.querySelector<HTMLElement>('[data-pill-indicator]');
	if (!nav || !indicator) return;

	const links = [...nav.querySelectorAll<HTMLAnchorElement>('[data-nav-link]')];
	let current: HTMLAnchorElement | null = null;

	const moveTo = (link: HTMLAnchorElement | null) => {
		links.forEach((l) => l.classList.toggle('is-lit', l === link));
		if (!link) {
			indicator.style.opacity = '0';
			return;
		}
		indicator.style.opacity = '1';
		indicator.style.width = `${link.offsetWidth}px`;
		indicator.style.transform = `translateX(${link.offsetLeft}px)`;
	};

	links.forEach((link) => {
		link.addEventListener('pointerenter', () => moveTo(link));
		link.addEventListener('focus', () => moveTo(link));
	});
	nav.addEventListener('pointerleave', () => moveTo(current));
	nav.addEventListener('focusout', (e) => {
		if (!nav.contains(e.relatedTarget as Node)) moveTo(current);
	});
	window.addEventListener('resize', () => moveTo(current));

	// Track the section in the middle of the viewport
	const sections = links
		.map((l) => document.getElementById(new URL(l.href).hash.slice(1)))
		.filter((s): s is HTMLElement => !!s);
	if (!sections.length) return;

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				current = links.find((l) => l.hash === `#${entry.target.id}`) ?? null;
				links.forEach((l) => l.setAttribute('aria-current', String(l === current)));
				if (!nav.matches(':hover')) moveTo(current);
			}
		},
		{ rootMargin: '-45% 0px -54% 0px' },
	);
	sections.forEach((s) => io.observe(s));

	// Nothing is "current" while the hero or an unlisted section (contact) is centred
	const neutral = ['top', 'contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
	const neutralIo = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				current = null;
				links.forEach((l) => l.setAttribute('aria-current', 'false'));
				if (!nav.matches(':hover')) moveTo(null);
			}
		},
		{ rootMargin: '-45% 0px -54% 0px' },
	);
	neutral.forEach((s) => neutralIo.observe(s));
}

export function initMobileMenu() {
	const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
	const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
	const label = document.querySelector<HTMLElement>('[data-menu-label]');
	if (!toggle || !menu) return;

	const root = document.documentElement;
	const main = document.getElementById('main');
	const footer = document.querySelector('footer');
	menu.setAttribute('data-lenis-prevent', '');
	menu.inert = true;

	const setOpen = (open: boolean) => {
		if (open === root.classList.contains('menu-open')) return;
		root.classList.toggle('menu-open', open);
		toggle.setAttribute('aria-expanded', String(open));
		if (label) label.textContent = open ? 'Close' : 'Menu';
		menu.inert = !open;
		if (main) main.inert = open;
		if (footer) footer.inert = open;

		if (open) {
			lockScroll();
			menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
		} else {
			unlockScroll();
		}
	};

	toggle.addEventListener('click', () => setOpen(!root.classList.contains('menu-open')));

	// Close on navigation (runs before the global anchor handler scrolls)
	menu.addEventListener('click', (e) => {
		if ((e.target as Element).closest('a')) setOpen(false);
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && root.classList.contains('menu-open')) {
			setOpen(false);
			toggle.focus();
		}
	});

	window.matchMedia('(min-width: 1061px)').addEventListener('change', (e) => {
		if (e.matches) setOpen(false);
	});
}
