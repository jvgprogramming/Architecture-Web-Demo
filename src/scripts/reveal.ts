import { DURATION, SPRING, finePointer, reduceMotion } from './motion';

/**
 * Scroll reveals. Elements with [data-reveal] get `.is-in` once, the first time they
 * enter the viewport; CSS keyframes do the rest. Each element is unobserved
 * immediately, so nothing animates twice.
 *
 * [data-reveal-scope] marks a container whose reveals fire together when the container
 * itself becomes visible. The cinematic footer needs this because its contents are
 * position: fixed and so always "in" the viewport.
 */
export function initReveals() {
	const scopes = [...document.querySelectorAll<HTMLElement>('[data-reveal-scope]')];
	const inScope = (el: Element) => scopes.some((s) => s.contains(el));
	const items = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => !inScope(el));

	if (reduceMotion || !('IntersectionObserver' in window)) {
		document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
		return;
	}

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-in');
				io.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
	);
	items.forEach((el) => io.observe(el));

	const scopeIo = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'));
				scopeIo.unobserve(entry.target);
			}
		},
		{ threshold: 0.3 },
	);
	scopes.forEach((s) => scopeIo.observe(s));
}

/** Statistics count up once when they come into view. */
export function initCounters() {
	const counters = document.querySelectorAll<HTMLElement>('[data-count]');
	if (reduceMotion || !counters.length) return;

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				const el = entry.target as HTMLElement;
				io.unobserve(el);
				const target = Number(el.dataset.count);
				const duration = DURATION.hero + 100; // 800ms, matches the reveal it sits in
				const start = performance.now();
				const tick = (now: number) => {
					const t = Math.min(1, (now - start) / duration);
					const eased = 1 - Math.pow(1 - t, 3);
					el.textContent = String(Math.round(target * eased));
					if (t < 1) requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			}
		},
		{ threshold: 0.6 },
	);

	counters.forEach((el) => {
		el.textContent = '0';
		io.observe(el);
	});
}

/**
 * Buttons marked [data-magnetic] lean slightly towards the pointer (hover only),
 * using the "standard" spring. Runs a rAF loop only while moving.
 */
export function initMagnetic() {
	if (reduceMotion || !finePointer) return;
	document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
		let tx = 0;
		let ty = 0;
		let x = 0;
		let y = 0;
		let raf = 0;
		const loop = () => {
			x += (tx - x) * SPRING.standard;
			y += (ty - y) * SPRING.standard;
			el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
			raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : 0;
			if (!raf && tx === 0 && ty === 0) el.style.translate = '';
		};
		const kick = () => {
			if (!raf) raf = requestAnimationFrame(loop);
		};
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			tx = (e.clientX - (r.left + r.width / 2)) * 0.2;
			ty = (e.clientY - (r.top + r.height / 2)) * 0.3;
			kick();
		});
		el.addEventListener('pointerleave', () => {
			tx = 0;
			ty = 0;
			kick();
		});
	});
}
