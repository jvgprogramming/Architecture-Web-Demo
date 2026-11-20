import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { reduceMotion } from './motion';

export { reduceMotion, finePointer } from './motion';

/** Smooth (inertia) scrolling. Disabled entirely when the user prefers reduced motion. */
export const lenis: Lenis | null = reduceMotion ? null : new Lenis({ autoRaf: true, lerp: 0.1 });

type Target = number | string | HTMLElement;

export function scrollToTarget(target: Target, { immediate = false } = {}) {
	let el: HTMLElement | null = null;
	if (typeof target === 'string') {
		if (target === '#' || target === '#top') target = 0;
		else el = document.querySelector<HTMLElement>(target);
	} else if (target instanceof HTMLElement) {
		el = target;
	}

	if (typeof target === 'number') {
		if (lenis) lenis.scrollTo(target, { immediate, duration: 1.2 });
		else window.scrollTo({ top: target, behavior: reduceMotion || immediate ? 'auto' : 'smooth' });
		return;
	}
	if (!el) return;

	if (lenis) lenis.scrollTo(el, { immediate, duration: 1.1 });
	else el.scrollIntoView({ behavior: reduceMotion || immediate ? 'auto' : 'smooth' });
}

let locks = 0;
export function lockScroll() {
	locks++;
	lenis?.stop();
	document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll() {
	locks = Math.max(0, locks - 1);
	if (locks > 0) return;
	document.documentElement.style.overflow = '';
	lenis?.start();
}

/* ---------------------------------------------------------------- shared scroll loop
 * One passive scroll listener and one resize listener for the whole site; modules
 * subscribe instead of attaching their own. Work is batched into a single rAF.
 */
type ScrollCb = (y: number) => void;
const subscribers = new Set<ScrollCb>();
let ticking = false;

const flush = () => {
	ticking = false;
	const y = window.scrollY;
	subscribers.forEach((cb) => cb(y));
};
const schedule = () => {
	if (!ticking) {
		ticking = true;
		requestAnimationFrame(flush);
	}
};
window.addEventListener('scroll', schedule, { passive: true });
window.addEventListener('resize', schedule, { passive: true });

/** Subscribe to the shared scroll loop. The callback also runs once immediately. Returns an unsubscribe function. */
export function onScroll(cb: ScrollCb) {
	subscribers.add(cb);
	cb(window.scrollY);
	return () => subscribers.delete(cb);
}

/** Intercept same-page anchor links so they use the smooth scroller and move focus. */
export function initAnchors(onNavigate?: () => void) {
	document.addEventListener('click', (event) => {
		const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
		if (!link || event.defaultPrevented || link.hasAttribute('data-open-project')) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;

		const url = new URL(link.href, location.href);
		if (url.pathname !== location.pathname || !url.hash) return;

		const hash = url.hash;
		const isTop = hash === '#' || hash === '#top';
		const el = isTop ? null : document.getElementById(decodeURIComponent(hash.slice(1)));
		if (!isTop && !el) return;

		event.preventDefault();
		onNavigate?.();
		scrollToTarget(isTop ? 0 : el!);
		history.replaceState(null, '', isTop ? location.pathname : hash);

		if (el) {
			if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
			el.focus({ preventScroll: true });
		}
	});
}
