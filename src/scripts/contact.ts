import { haptic, reduceMotion } from './motion';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(field: Field): string {
	const value = field.type === 'checkbox' ? '' : field.value.trim();

	switch (field.name) {
		case 'name':
			if (!value) return 'Enter your name.';
			if (value.length < 2) return 'Your name needs at least 2 characters.';
			return '';
		case 'email':
			if (!value) return 'Enter your email address.';
			if (!EMAIL_RE.test(value)) return 'Enter an email address in the format name@example.com.';
			return '';
		case 'projectType':
			return value ? '' : 'Choose the type of project.';
		case 'message':
			if (!value) return 'Tell us a little about the project.';
			if (value.length < 20) return `Add a few more details (at least 20 characters, ${value.length} so far).`;
			return '';
		case 'consent':
			return (field as HTMLInputElement).checked ? '' : 'Tick the box so we can store your details and reply.';
		default:
			return '';
	}
}

/** Contact form: inline validation, then submit to PUBLIC_CONTACT_ENDPOINT or fall back to a pre-filled email. */
export function initContactForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
	if (!form) return;

	const status = form.querySelector<HTMLElement>('[data-form-status]')!;
	const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
	const fields = [...form.querySelectorAll<Field>('input:not([name="_gotcha"]), select, textarea')];
	const endpoint = form.dataset.endpoint?.trim();
	const studioEmail = form.dataset.email!;
	let attempted = false;

	const showError = (field: Field, message: string) => {
		const wrap = field.closest('.field');
		const errorEl = wrap?.querySelector<HTMLElement>('.field__error');
		wrap?.classList.toggle('field--error', !!message);
		field.setAttribute('aria-invalid', String(!!message));
		if (errorEl) errorEl.textContent = message;
	};

	const check = (field: Field) => {
		const message = validate(field);
		showError(field, message);
		return !message;
	};

	fields.forEach((field) => {
		field.addEventListener('blur', () => {
			if (attempted || field.value) check(field);
		});
		field.addEventListener(field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input', () => {
			if (attempted || field.getAttribute('aria-invalid') === 'true') check(field);
		});
	});

	const setStatus = (text: string, state: 'idle' | 'success' | 'error' = 'idle') => {
		status.textContent = text;
		status.dataset.state = state;
		// Re-trigger the short entrance so each new message is noticed
		status.classList.remove('is-new');
		void status.offsetWidth;
		status.classList.add('is-new');
		// Haptics only for the outcome of the user's own submit
		if (state === 'success') haptic('success');
		if (state === 'error') haptic('error');
	};

	/** One subtle shake on fields that failed validation after a submit attempt. */
	const shake = (fieldsToShake: Field[]) => {
		if (reduceMotion) return;
		fieldsToShake.forEach((f) => {
			const wrap = f.closest<HTMLElement>('.field');
			if (!wrap) return;
			wrap.classList.remove('field--shake');
			void wrap.offsetWidth;
			wrap.classList.add('field--shake');
			wrap.addEventListener('animationend', () => wrap.classList.remove('field--shake'), { once: true });
		});
	};

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		attempted = true;

		const invalid = fields.filter((f) => !check(f));
		if (invalid.length) {
			setStatus(`Fix ${invalid.length === 1 ? '1 field' : `${invalid.length} fields`} before sending.`, 'error');
			shake(invalid);
			invalid[0].focus();
			return;
		}

		// Honeypot: real visitors never fill this in
		const honeypot = form.querySelector<HTMLInputElement>('[name="_gotcha"]');
		if (honeypot?.value) {
			setStatus('Thank you. Your enquiry has been sent.', 'success');
			form.reset();
			return;
		}

		const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
		delete data._gotcha;

		if (!endpoint) {
			// No backend configured: open the visitor's email app with everything filled in.
			const body = [
				`Name: ${data.name}`,
				`Email: ${data.email}`,
				`Project type: ${data.projectType}`,
				`Budget: ${data.budget || 'Not given'}`,
				'',
				data.message,
			].join('\n');
			window.location.href = `mailto:${studioEmail}?subject=${encodeURIComponent(
				`New project enquiry from ${data.name}`,
			)}&body=${encodeURIComponent(body)}`;
			setStatus(
				`Your email app has opened with the enquiry filled in. Send it from there, or write to ${studioEmail}.`,
				'success',
			);
			return;
		}

		submit.disabled = true;
		submit.classList.add('is-loading');
		setStatus('Sending your enquiry…');

		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({ ...data, _subject: `New project enquiry from ${data.name}` }),
			});
			if (!res.ok) throw new Error(String(res.status));
			form.reset();
			attempted = false;
			fields.forEach((f) => showError(f, ''));
			setStatus('Thank you. Your enquiry has been sent, and a partner will reply within two working days.', 'success');
		} catch {
			setStatus(
				`The enquiry could not be sent. Check your connection and try again, or email ${studioEmail} directly.`,
				'error',
			);
		} finally {
			submit.disabled = false;
			submit.classList.remove('is-loading');
		}
	});
}
