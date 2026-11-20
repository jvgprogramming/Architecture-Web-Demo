import { finePointer, lockScroll, reduceMotion, scrollToTarget, unlockScroll } from './smooth';
import { DURATION, SPRING } from './motion';

export function initWork() {
	initFilters();
	if (finePointer) {
		initIndexPreview();
		initCursorBadge();
	}
	initProjectDialog();
}

/* ---------- Category filters for the project index ---------- */

function initFilters() {
	const index = document.querySelector<HTMLElement>('[data-index]');
	if (!index) return;
	const buttons = [...index.querySelectorAll<HTMLButtonElement>('[data-filter]')];
	const rows = [...index.querySelectorAll<HTMLElement>('.index-row')];
	const count = index.querySelector<HTMLElement>('[data-index-count]');
	const empty = index.querySelector<HTMLElement>('[data-index-empty]');

	buttons.forEach((btn) =>
		btn.addEventListener('click', () => {
			const filter = btn.dataset.filter!;
			buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
			let visible = 0;
			rows.forEach((row) => {
				const show = filter === 'All' || row.dataset.category === filter;
				row.hidden = !show;
				if (show) visible++;
			});
			if (count) count.textContent = String(visible);
			if (empty) empty.hidden = visible > 0;
		}),
	);
}

/* ---------- Floating image preview that follows the cursor over the index ---------- */

function initIndexPreview() {
	const list = document.querySelector<HTMLElement>('.index-list');
	const preview = document.querySelector<HTMLElement>('[data-index-preview]');
	if (!list || !preview) return;
	const imgs = [...preview.querySelectorAll<HTMLImageElement>('[data-preview-img]')];

	let x = 0;
	let y = 0;
	let cx = 0;
	let cy = 0;
	let raf = 0;
	let active = false;

	const loop = () => {
		cx += (x - cx) * (reduceMotion ? 1 : SPRING.standard);
		cy += (y - cy) * (reduceMotion ? 1 : SPRING.standard);
		const w = preview.offsetWidth;
		const h = preview.offsetHeight;
		preview.style.transform = `translate3d(${cx + 32}px, ${cy - h / 2}px, 0) rotate(${((x - cx) * 0.02).toFixed(2)}deg)`;
		// keep the preview on screen
		if (cx + 32 + w > window.innerWidth) preview.style.transform = `translate3d(${cx - w - 32}px, ${cy - h / 2}px, 0)`;
		raf = active ? requestAnimationFrame(loop) : 0;
	};

	list.addEventListener('pointermove', (e) => {
		x = e.clientX;
		y = e.clientY;
		const row = (e.target as Element).closest<HTMLElement>('[data-preview]');
		if (!row) return;
		const slug = row.dataset.preview;
		imgs.forEach((img) => img.classList.toggle('is-active', img.dataset.previewImg === slug));
		if (!active) {
			active = true;
			cx = x;
			cy = y;
			preview.classList.add('is-visible');
			raf = requestAnimationFrame(loop);
		}
	});

	const hide = () => {
		active = false;
		preview.classList.remove('is-visible');
		cancelAnimationFrame(raf);
	};
	list.addEventListener('pointerleave', hide);
	window.addEventListener('scroll', () => active && hide(), { passive: true });
}

/* ---------- "View" badge that follows the cursor over featured projects ---------- */

function initCursorBadge() {
	const badge = document.querySelector<HTMLElement>('[data-cursor-badge]');
	if (!badge) return;
	let x = 0;
	let y = 0;
	let cx = 0;
	let cy = 0;
	let raf = 0;

	const loop = () => {
		cx += (x - cx) * SPRING.expressive;
		cy += (y - cy) * SPRING.expressive;
		badge.style.translate = `${cx}px ${cy}px`;
		raf = requestAnimationFrame(loop);
	};

	document.querySelectorAll<HTMLElement>('[data-cursor]').forEach((el) => {
		el.addEventListener('pointerenter', (e) => {
			x = cx = e.clientX;
			y = cy = e.clientY;
			badge.textContent = el.dataset.cursor || 'View';
			badge.classList.add('is-visible');
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(loop);
		});
		el.addEventListener('pointermove', (e) => {
			x = e.clientX;
			y = e.clientY;
		});
		el.addEventListener('pointerleave', () => {
			badge.classList.remove('is-visible');
			window.setTimeout(() => {
				if (!badge.classList.contains('is-visible')) cancelAnimationFrame(raf);
			}, DURATION.standard);
		});
	});
}

/* ---------- Project detail dialog with deep links (#p-slug) ---------- */

function initProjectDialog() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-project-dialog]');
	if (!dialog) return;
	dialog.setAttribute('data-lenis-prevent', '');

	const articles = [...dialog.querySelectorAll<HTMLElement>('[data-project]')];
	const slugs = articles.map((a) => a.dataset.project!);
	const count = dialog.querySelector<HTMLElement>('[data-dialog-count]');
	let current = -1;
	let opener: HTMLElement | null = null;
	let closing = false;

	const show = (i: number) => {
		current = (i + slugs.length) % slugs.length;
		articles.forEach((a, j) => (a.hidden = j !== current));
		const title = articles[current].getAttribute('aria-label') ?? '';
		dialog.setAttribute('aria-label', title);
		if (count) count.textContent = `${current + 1} / ${slugs.length}`;
		dialog.scrollTop = 0;
		history.replaceState(null, '', `#p-${slugs[current]}`);
	};

	const open = (slug: string, trigger?: HTMLElement | null) => {
		const i = slugs.indexOf(slug);
		if (i < 0) return;
		opener = trigger ?? null;
		show(i);
		if (!dialog.open) {
			dialog.showModal();
			lockScroll();
		}
		dialog.querySelector<HTMLElement>('[data-dialog-close]')?.focus();
	};

	const close = (after?: () => void) => {
		if (!dialog.open || closing) return;
		closing = true;
		const finish = () => {
			dialog.classList.remove('is-closing');
			dialog.close();
			closing = false;
			unlockScroll();
			history.replaceState(null, '', location.pathname);
			if (after) after();
			else opener?.focus({ preventScroll: true });
		};
		if (reduceMotion) return finish();
		dialog.classList.add('is-closing');
		window.setTimeout(finish, DURATION.standard);
	};

	document.addEventListener('click', (e) => {
		const trigger = (e.target as Element).closest<HTMLElement>('[data-open-project]');
		if (!trigger) return;
		e.preventDefault();
		open(trigger.dataset.openProject!, trigger);
	});

	dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => close());
	dialog.querySelector('[data-dialog-prev]')?.addEventListener('click', () => show(current - 1));
	dialog.querySelector('[data-dialog-next]')?.addEventListener('click', () => show(current + 1));

	dialog.addEventListener('cancel', (e) => {
		e.preventDefault();
		close();
	});

	dialog.addEventListener('keydown', (e) => {
		const tag = (e.target as HTMLElement).tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA') return;
		if (e.key === 'ArrowRight') show(current + 1);
		if (e.key === 'ArrowLeft') show(current - 1);
	});

	// "Discuss a similar project": close, scroll to the form and pre-fill the message.
	dialog.querySelectorAll<HTMLAnchorElement>('[data-dialog-contact]').forEach((link) =>
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const title = articles[current].getAttribute('aria-label');
			close(() => {
				const message = document.querySelector<HTMLTextAreaElement>('#cf-message');
				if (message && !message.value.trim()) {
					message.value = `I'm planning a project similar to ${title}. `;
				}
				scrollToTarget('#contact');
				window.setTimeout(() => document.querySelector<HTMLElement>('#cf-name')?.focus({ preventScroll: true }), DURATION.hero);
			});
		}),
	);

	// Deep link: open the project named in the URL hash on load
	const fromHash = () => {
		const m = location.hash.match(/^#p-(.+)$/);
		if (m) open(m[1]);
	};
	fromHash();
	window.addEventListener('hashchange', fromHash);
}
