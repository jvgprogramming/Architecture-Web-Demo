import { onScroll, reduceMotion } from './smooth';
import { DURATION, HERO_ANNOTATION_DELAY } from './motion';

const IMG_RATIO = 2400 / 1600;

/**
 * Hero annotations: hotspots are stored as fractions of the photo. This maps them onto the
 * object-fit: cover crop (anchored bottom-centre), then draws a connector line from each
 * hotspot to the nearest edge of its note card.
 */
export function initHero() {
	const hero = document.querySelector<HTMLElement>('[data-hero]');
	if (!hero) return;

	const media = hero.querySelector<HTMLElement>('[data-hero-media]');
	const layer = hero.querySelector<HTMLElement>('.hero__annotations');
	const svg = hero.querySelector<SVGSVGElement>('[data-hero-lines]');
	const spots = [...hero.querySelectorAll<HTMLElement>('[data-spot]')];

	const layout = () => {
		if (!svg || !layer) return;
		const W = hero.clientWidth;
		const H = hero.clientHeight;
		svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

		// object-fit: cover with object-position 50% 100% (horizontally centred, bottom-aligned)
		const imgW = Math.max(W, H * IMG_RATIO);
		const imgH = imgW / IMG_RATIO;
		const offX = (W - imgW) / 2;
		const offY = H - imgH;
		const heroRect = hero.getBoundingClientRect();
		const layerShift = layer.getBoundingClientRect().top - heroRect.top; // parallax offset

		for (const spot of spots) {
			const x = offX + Number(spot.dataset.x) * imgW;
			const y = offY + Number(spot.dataset.y) * imgH;
			// `translate` positions the dot; CSS animates `transform: scale()` independently
			spot.style.translate = `${x}px ${y}px`;

			const id = spot.dataset.spot;
			const note = hero.querySelector<HTMLElement>(`[data-note="${id}"]`);
			const line = svg.querySelector<SVGLineElement>(`[data-line="${id}"]`);
			if (!note || !line) continue;

			const r = note.getBoundingClientRect();
			const left = r.left - heroRect.left;
			const top = r.top - heroRect.top - layerShift;
			const ex = Math.min(Math.max(x, left), left + r.width);
			const ey = Math.min(Math.max(y, top), top + r.height);

			line.setAttribute('x1', String(x));
			line.setAttribute('y1', String(y));
			line.setAttribute('x2', String(ex));
			line.setAttribute('y2', String(ey));
			line.style.setProperty('--len', String(Math.hypot(ex - x, ey - y) + 2));
		}
	};

	layout();
	window.addEventListener('resize', layout, { passive: true });
	document.fonts?.ready.then(layout);

	// Reveal annotations after the headline has landed
	const readyDelay = reduceMotion ? 0 : HERO_ANNOTATION_DELAY;
	window.setTimeout(() => hero.classList.add('is-ready'), readyDelay);
	// Notes rise 10px into place; re-measure once they have settled.
	window.setTimeout(layout, readyDelay + DURATION.section + 100);

	// The site's only scroll-linked effect: a restrained parallax on the hero photo
	// (15% of scroll speed), desktop only. Annotations move with it so hotspots stay on
	// the building. It stops updating once the hero is out of view.
	const desktop = window.matchMedia('(min-width: 901px)');
	if (!reduceMotion && media && layer) {
		onScroll((y) => {
			if (!desktop.matches) {
				media.style.translate = layer.style.translate = '';
				return;
			}
			if (y > hero.offsetHeight) return;
			const shift = `0 ${(y * 0.15).toFixed(1)}px`;
			media.style.translate = shift;
			layer.style.translate = shift;
		});
	}
}
