import type { ImageMetadata } from 'astro';

import heroDuskHouse from '../assets/images/hero-dusk-house.jpg';
import detailOrangeCurve from '../assets/images/detail-orange-curve.jpg';
import timberHouse from '../assets/images/timber-house.jpg';
import cliffVilla from '../assets/images/cliff-villa.jpg';
import whiteCourtyard from '../assets/images/white-courtyard.jpg';
import cedarResidence from '../assets/images/cedar-residence.jpg';
import terraceHouse from '../assets/images/terrace-house.jpg';
import livingInterior from '../assets/images/living-interior.jpg';
import openPlanInterior from '../assets/images/open-plan-interior.jpg';
import stoneBath from '../assets/images/stone-bath.jpg';
import glassStair from '../assets/images/glass-stair.jpg';
import drafting from '../assets/images/drafting.jpg';
import siteTeam from '../assets/images/site-team.jpg';
import glassTowers from '../assets/images/glass-towers.jpg';
import siteAerial from '../assets/images/site-aerial.jpg';
import poolHouse from '../assets/images/pool-house.jpg';
import palmVilla from '../assets/images/palm-villa.jpg';

/* ------------------------------------------------------------------ */
/*  Studio details — edit these to match the real business.           */
/* ------------------------------------------------------------------ */

export const studio = {
	name: 'Minor Mass',
	tagline: 'Architecture & Interiors',
	founded: 2009,
	email: 'hello@minormass.studio',
	phone: '+351 210 123 456',
	address: ['Rua das Flores 28', '1200-195 Lisboa', 'Portugal'],
	hours: 'Mon – Fri, 09:00 – 18:00',
	description:
		'Minor Mass is an architecture and interiors studio in Lisbon. We design calm, material-led homes and workplaces, from the first sketch to the final key.',
	socials: [
		{ label: 'Instagram', href: 'https://www.instagram.com/' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/' },
		{ label: 'Pinterest', href: 'https://www.pinterest.com/' },
	],
};

export const nav = [
	{ label: 'Studio', href: '#studio' },
	{ label: 'Services', href: '#services' },
	{ label: 'Process', href: '#process' },
	{ label: 'Work', href: '#work' },
	{ label: 'Voices', href: '#testimonials' },
	{ label: 'Contact', href: '#contact' },
];

export const images = {
	hero: heroDuskHouse,
	detail: detailOrangeCurve,
	drafting,
	siteTeam,
	timberHouse,
	glassStair,
	livingInterior,
	cliffVilla,
	whiteCourtyard,
	cedarResidence,
};

export const stats = [
	{ value: 320, suffix: '+', label: 'Families and companies have trusted us with their buildings.' },
	{ value: 96, suffix: '%', label: 'Of clients say they would hire us again for their next project.' },
];

export interface Service {
	title: string;
	summary: string;
	deliverables: string[];
	image: ImageMetadata;
	alt: string;
}

export const services: Service[] = [
	{
		title: 'Architecture',
		summary:
			'New homes, extensions and small public buildings. Each one is shaped by its site, its light and the people who will live in it, not by a house style.',
		deliverables: ['Feasibility', 'Concept design', 'Planning', 'Construction drawings'],
		image: palmVilla,
		alt: 'White modernist villa with a pool and palm trees',
	},
	{
		title: 'Interior Architecture',
		summary:
			'Rooms planned from the inside out: joinery, lighting, finishes and furniture designed as one continuous system with the building itself.',
		deliverables: ['Space planning', 'Bespoke joinery', 'Lighting design', 'FF&E curation'],
		image: openPlanInterior,
		alt: 'Open-plan living room with a timber feature wall and soft daylight',
	},
	{
		title: 'Landscape & Site',
		summary:
			'Terraces, courtyards and gardens that link the inside to the outside, using planting and hardscape chosen to age well in the local climate.',
		deliverables: ['Site strategy', 'Courtyards', 'Pools & terraces', 'Planting plans'],
		image: terraceHouse,
		alt: 'White terraced house with a pool and a sun deck',
	},
	{
		title: 'Renovation & Reuse',
		summary:
			'Careful work with existing buildings. We keep what has character, remove what does not, and bring structure and services up to modern standards.',
		deliverables: ['Building surveys', 'Heritage consent', 'Structural upgrades', 'Energy retrofit'],
		image: siteAerial,
		alt: 'Seen from above, builders in orange vests work among steel reinforcement on a concrete slab',
	},
];

export const process: { title: string; phase: string; duration: string; text: string; image: ImageMetadata; alt: string }[] = [
	{
		title: 'Listen',
		phase: 'Brief & site',
		duration: '2 – 4 weeks',
		text: 'We visit the site, study its orientation and constraints, and write a brief with you that covers ambitions, budget and timeline.',
		image: drafting,
		alt: 'An architect drawing details by hand on a large sheet',
	},
	{
		title: 'Shape',
		phase: 'Concept design',
		duration: '6 – 10 weeks',
		text: 'Sketches, models and material studies, refined with you until the concept feels inevitable rather than merely possible.',
		image: detailOrangeCurve,
		alt: 'Curved terracotta-coloured timber fins against a blue sky',
	},
	{
		title: 'Detail',
		phase: 'Technical & permits',
		duration: '8 – 16 weeks',
		text: 'Coordinated drawings, engineering and specifications. We handle planning submissions and contractor tendering for you.',
		image: glassStair,
		alt: 'Floating oak staircase beside full-height glazing',
	},
	{
		title: 'Build',
		phase: 'Construction & handover',
		duration: 'Project length',
		text: 'Regular site visits, quality control and cost tracking, ending with a complete handover and a follow-up visit after twelve months.',
		image: siteTeam,
		alt: 'The project team standing on a concrete slab during construction',
	},
];

export type ProjectCategory = 'Residential' | 'Interior' | 'Workplace';

export interface Project {
	slug: string;
	title: string;
	location: string;
	year: number;
	category: ProjectCategory;
	area: string;
	featured: boolean;
	summary: string;
	cover: ImageMetadata;
	coverAlt: string;
	detail: ImageMetadata;
	detailAlt: string;
}

export const projects: Project[] = [
	{
		slug: 'cliff-villa',
		title: 'Cliff Villa',
		location: 'Comporta, Portugal',
		year: 2025,
		category: 'Residential',
		area: '420 m²',
		featured: true,
		summary:
			'A holiday house of three stacked white volumes, cantilevered towards the Atlantic. Deep timber soffits shade the glazing, and a narrow lap pool runs along the full length of the living floor.',
		cover: cliffVilla,
		coverAlt: 'White modern villa with timber soffits overlooking a long pool',
		detail: openPlanInterior,
		detailAlt: 'Bright living room with timber wall and sculptural furniture',
	},
	{
		slug: 'timber-house',
		title: 'Timber House',
		location: 'Sintra, Portugal',
		year: 2024,
		category: 'Residential',
		area: '265 m²',
		featured: true,
		summary:
			'A family home tucked into a sloping forest plot. Charred larch and oiled oak frame a double-height hall, and a folding roof lets winter sun reach the back of the plan.',
		cover: timberHouse,
		coverAlt: 'Timber-clad house with a folded roof and a double-height glazed hall',
		detail: glassStair,
		detailAlt: 'Floating oak staircase in a glazed hall',
	},
	{
		slug: 'casa-patio',
		title: 'Casa Pátio',
		location: 'Alentejo, Portugal',
		year: 2023,
		category: 'Residential',
		area: '310 m²',
		featured: true,
		summary:
			'Lime-washed walls wrap a sequence of courtyards. Each one gives the rooms around it shade, cross-ventilation and a private view, which keeps the house cool through Alentejo summers.',
		cover: whiteCourtyard,
		coverAlt: 'Lime-washed white house with a courtyard, pine trees and blue sky',
		detail: stoneBath,
		detailAlt: 'Dark stone bathroom with a freestanding bath and a clerestory window',
	},
	{
		slug: 'cedar-residence',
		title: 'Cedar Residence',
		location: 'Porto, Portugal',
		year: 2024,
		category: 'Residential',
		area: '238 m²',
		featured: true,
		summary:
			'A compact suburban house where a cedar-clad volume rests on a plinth of white render. Large picture windows frame the garden, while the street side stays quiet and private.',
		cover: cedarResidence,
		coverAlt: 'Contemporary house with cedar cladding and white render',
		detail: livingInterior,
		detailAlt: 'Living room with low sofa, clerestory windows and warm timber',
	},
	{
		slug: 'terrace-house',
		title: 'Terrace House',
		location: 'Cascais, Portugal',
		year: 2022,
		category: 'Residential',
		area: '355 m²',
		featured: false,
		summary:
			'Three stepped terraces turn a steep coastal plot into a series of outdoor rooms, linked by a pool that reflects the white façades.',
		cover: poolHouse,
		coverAlt: 'White two-storey house with a deep veranda above a pool framed by palms',
		detail: terraceHouse,
		detailAlt: 'White terraced house with a pool and sun deck',
	},
	{
		slug: 'lapa-apartment',
		title: 'Lapa Apartment',
		location: 'Lisbon, Portugal',
		year: 2025,
		category: 'Interior',
		area: '180 m²',
		featured: false,
		summary:
			'A 19th-century apartment opened up around a new oak spine. The spine holds storage, a kitchen and a library, and frees the original rooms for daylight and long views.',
		cover: livingInterior,
		coverAlt: 'Warm living room with clerestory windows and low furniture',
		detail: stoneBath,
		detailAlt: 'Stone bathroom with freestanding tub',
	},
	{
		slug: 'doca-workplace',
		title: 'Doca Workplace',
		location: 'Lisbon, Portugal',
		year: 2023,
		category: 'Workplace',
		area: '2,400 m²',
		featured: false,
		summary:
			'The fit-out of four floors in a glass tower for a design consultancy. Terracotta-toned studios sit around a central stair that brings the teams together.',
		cover: glassTowers,
		coverAlt: 'Glass office towers seen from below against a grey sky',
		detail: detailOrangeCurve,
		detailAlt: 'Curved terracotta-coloured slatted façade against a blue sky',
	},
];

export const testimonials = [
	{
		quote:
			'They listened for longer than anyone else we spoke to, and it shows in every corner of the house. It feels as if it has always been there.',
		name: 'Inês & Tomás Ferreira',
		role: 'Clients, Timber House',
		rating: 5,
	},
	{
		quote:
			'Minor Mass treated our budget as a design constraint, not an afterthought. The building came in on cost, on time, and better than the renders.',
		name: 'Marta Lindqvist',
		role: 'Director, Nordlys Consulting',
		rating: 5,
	},
	{
		quote:
			'They are calm on site and precise on paper. Of all the architects we have worked with, they are among the very few we would call first.',
		name: 'Rui Almeida',
		role: 'Managing Director, Almeida Construções',
		rating: 4.8,
	},
];

export const projectTypes = ['New home', 'Renovation', 'Interior', 'Workplace', 'Other'];
export const budgets = ['Under €250k', '€250k – €750k', '€750k – €2M', 'Above €2M', 'Not sure yet'];

/** Studio commitments shown in the dark band under the process. */
export const commitments = [
	{
		icon: 'shield',
		title: 'Uncompromising quality',
		text: 'We specify materials for the next fifty years, not the next five, and check every detail on site.',
	},
	{
		icon: 'person',
		title: 'One partner throughout',
		text: 'The partner who walks your site on day one is the same one who hands you the keys.',
	},
	{
		icon: 'coin',
		title: 'Fixed fee per stage',
		text: 'Each stage has a clear scope and a fixed price, agreed before any work begins.',
	},
	{
		icon: 'leaf',
		title: 'Low-energy by default',
		text: 'Passive design comes first. Every house we build is designed to need little heating or cooling.',
	},
] as const;
