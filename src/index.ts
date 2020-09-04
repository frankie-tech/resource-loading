import render from './modules/render';
import { ResourceOptions, ResourceConfigs } from './index.d';

/*
const resources = [
	[
		'js:smooth-scroll',
		{
			skipCondition: () =>
				document.querySelectorAll('a.scroll[href^="#"]').length < 1,
			url: '[[~24]]',
			callback: () => initSmoothScroll(),
		},
	],
	[
		'js:lazy-sizes',
		{
			skipCondition: () =>
				document.querySelectorAll('.lazyload').length < 1,
			url: '[[~25]]',
			async: false,
		},
	],
	[
		'js:lazy-sizes-native',
		{
			url: '[[~26]]',
			callback: () => window.lazySizes.init(),
			skipCondition: () =>
				document.querySelectorAll('img[loading="lazy"]').length < 1,
			skipCallback: () => window.lazySizes.init(),
			async: false,
		},
	],
];

const configs = {
	['js:bouncer-form']: {
		url: '[[~14]]',
		callback: () => handleFormValidator(),
		id: 'bouncerFormValidation',
	},
	['js:plugin-choices']: {
		url: '[[~33]]',
	},
	['js:form-scripts']: {
		url: '[[~23]]',
	},
	['js:plugin-micro-modal']: {
		url: '[[~27]]',
		callback: () => window.MicroModal.init({ disableScroll: true }),
	},
	['js:career-modal']: {
		url: '[[~32]]',
	},
};
*/

export default class ResourceLoader {
	resources: Map<string, ResourceOptions>;
	configs: ResourceConfigs;
	elements: Element[];
	static template: string;
	loadCount: number;
	callbacks: Function[];
	constructor(
		defaults: [string, ResourceOptions][],
		configs: ResourceConfigs
	) {
		this.resources = new Map(defaults) as any;
		this.configs = configs;
		this.elements = [];
		this.callbacks = [];
		this.loadCount = 0;
	}

	template(
		key: string,
		options: {
			id?: string;
			async?: boolean;
			defer?: boolean;
			callback?: Function;
		}
	): string {
		const [type, name] = key.split(':');
		const id = options.id || name;

		// if either the defer or async options are false
		// don't add that attribute
		var defer = !options.defer ? '' : 'defer';
		var async = !options.async ? '' : 'async';

		var media =
			!options.defer || !options.async
				? ''
				: `media="print" onload="this.onload=null;this.media='all';"`;

		return type === 'js'
			? /* prettier-ignore */
			  `<script id="${id}" ${defer} ${async} onload="${options.callback}"></script>`
			: /* prettier-ignore */
			  `<link rel="stylesheet" id="${id}" ${media} />`;
	}

	loaded() {
		this.loadCount += 1;
		this.loadCount === this.resources.size
			? this.callbacks.forEach(cb => cb !== null && cb())
			: new Error('Issue with loaded callbacks');
	}

	renderResource(key: string, options: ResourceOptions) {
		const { skipCondition = null, skipCallback = () => {} } = options;
		if (skipCondition !== null && skipCondition()) {
			return skipCallback();
		}

		const resourceHTML = this.template(key, options);

		const tplEl = document.createElement('template');
		tplEl.innerHTML = resourceHTML;
		const resource = tplEl.content.firstChild as HTMLElement;

		resource.addEventListener('load', () => this.loaded(), {
			once: true,
			capture: false,
		});

		resource.setAttribute(
			key.split(':')[0] === 'js' ? 'src' : 'href',
			options.url
		);

		this.elements.push(resource);
	}

	appendResource(element: Element) {
		const insertedElement = document.head.insertAdjacentElement(
			'beforeend',
			element
		);

		return (
			insertedElement !== null || new Error('Element insertion failed')
		);
	}

	getDocumentResources() {
		if (typeof window === undefined || typeof document === undefined)
			return;
		const bodyDataset =
			document.body.hasAttribute('data-resources') &&
			document.body.dataset.resources;
		if (!bodyDataset) return;
		const attrResources =
			bodyDataset.indexOf(',') > 0
				? bodyDataset.split(',')
				: [bodyDataset];

		attrResources.forEach(resource => {
			const config = this.configs[resource];
			this.resources.set(resource, config);
		});
	}

	init() {
		// gets document resources
		this.getDocumentResources();

		// prettier-ignore
		document.addEventListener('readystatechange',
			() => {
				if (document.readyState !== 'complete') return;
				// console.log(this);
				try {
					// prettier-ignore
					this.resources.forEach((options, key) => {
						var cb = 'callback' in options ? options.callback : () => {};
						if (cb !== undefined) {
							this.callbacks.push(cb)
						}
						this.renderResource(key, options)
					});
					
					this.elements.forEach(el => this.appendResource(el));
					return true;
				} catch (err) {
					console.error(err);
				}
		// prettier-ignore
		}, false);
	}
}

// const resources: Map<string, ResourceOptions> = new Map();
/*
const documentResources = (function () {
	const bodyDataset =
		document.body.hasAttribute('data-resources') &&
		document.body.dataset.resources;
	if (!bodyDataset) return;
	const attrResources =
		bodyDataset.indexOf(',') > 0 ? bodyDataset.split(',') : [bodyDataset];
	// console.log(attrResources);

	attrResources.forEach(resource => {
		const config = configs[resource];

		_.resources.set(resource, config);
	});
})();

resources.forEach((value, key) => {
	if (value === undefined || key === 'false') return;

	const noop = () => {}; // a do nothing function, defined as a default for callbacks that are undefined
	const [type, name] = key.split(':');
	const {
		url,
		callback = noop,
		skipCondition = () => false, // if the skip condition is undefined, always go through
		skipCallback = noop,
		id = name,
	} = value;

	if (skipCondition()) return skipCallback();

	const options = Object.assign(value, {
		[type === 'js' ? 'src' : 'href']: url,
		id,
		callback,
	});

	var el = _.render(type, options);

	document.head.appendChild(el);
});
*/
