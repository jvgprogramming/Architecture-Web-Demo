/**
 * Stacked testimonials: one is active (full opacity, orange edge), the rest are dimmed.
 * Changes only when the user clicks a card or the arrows; nothing advances on its own.
 */
export function initTestimonials() {
	const root = document.querySelector<HTMLElement>('[data-voices]');
	if (!root) return;

	const cards = [...root.querySelectorAll<HTMLButtonElement>('[data-voice]')];
	const current = root.querySelector<HTMLElement>('[data-voices-current]');
	let index = 0;

	const go = (i: number) => {
		index = (i + cards.length) % cards.length;
		cards.forEach((c, j) => {
			const active = j === index;
			c.classList.toggle('is-active', active);
			c.setAttribute('aria-pressed', String(active));
		});
		if (current) current.textContent = String(index + 1);
	};

	cards.forEach((c, i) => c.addEventListener('click', () => go(i)));
	root.querySelector('[data-voices-prev]')?.addEventListener('click', () => go(index - 1));
	root.querySelector('[data-voices-next]')?.addEventListener('click', () => go(index + 1));
}
