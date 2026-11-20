/**
 * Shared motion configuration.
 *
 * CSS owns almost all animation (tokens in src/styles/global.css :root). This module
 * mirrors those tokens for the few JS-driven effects, and centralises the user's
 * reduced-motion preference and haptic feedback.
 */

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Durations in ms; keep in sync with --dur-* in global.css. */
export const DURATION = {
	micro: 150,
	standard: 250,
	section: 500,
	hero: 700,
} as const;

/**
 * Spring presets for JS-driven, pointer-following motion, as per-frame lerp factors
 * (the fraction of the remaining distance covered each frame).
 * Higher = snappier. None of them overshoot.
 */
export const SPRING = {
	gentle: 0.1,
	standard: 0.16,
	expressive: 0.24,
} as const;

/** Delay, in ms, after which hero annotations draw (after the headline lands). */
export const HERO_ANNOTATION_DELAY = 550;

/* ---------------------------------------------------------------- haptics
 * Only for the outcome of a user-initiated action (success or failure), and only
 * where the Vibration API exists on a touch device. Desktop and iOS Safari, which
 * have no Vibration API, are silently skipped.
 */
const canVibrate =
	typeof navigator !== 'undefined' &&
	'vibrate' in navigator &&
	window.matchMedia('(pointer: coarse)').matches;

const PATTERNS = {
	success: [12],
	error: [24, 60, 24],
} as const;

export function haptic(kind: keyof typeof PATTERNS) {
	if (!canVibrate) return;
	try {
		navigator.vibrate([...PATTERNS[kind]]);
	} catch {
		/* blocked by browser policy, ignore */
	}
}
