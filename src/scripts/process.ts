/** Horizontal accordion of process stages. Changes only when the user picks a stage. */
export function initProcess() {
	const root = document.querySelector<HTMLElement>('[data-steps]');
	if (!root) return;

	const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
	let index = Math.max(0, steps.findIndex((s) => s.classList.contains('is-active')));

	const go = (i: number) => {
		index = (i + steps.length) % steps.length;
		steps.forEach((s, j) => {
			const active = j === index;
			s.classList.toggle('is-active', active);
			s.setAttribute('aria-expanded', String(active));
		});
	};

	steps.forEach((step, i) => {
		step.addEventListener('click', () => go(i));
		step.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				go(i);
			}
			if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
				e.preventDefault();
				steps[(i + 1) % steps.length].focus();
			}
			if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
				e.preventDefault();
				steps[(i - 1 + steps.length) % steps.length].focus();
			}
		});
	});
}
