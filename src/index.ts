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
	resources: ResourceConfigs<
		{ [key: string]: string },
		{ [key: string]: ResourceOptions }
	>;
	configs: { [index: string]: ResourceOptions };
	constructor(
		defaults: [string, ResourceOptions][],
		configs: { [index: string]: ResourceOptions }
	) {
		this.resources = new Map(defaults as any) as any;
		this.configs = configs;
		console.log(this);
	}

	renderResource(value: ResourceOptions, key: string) {}

	static get documentResources() {
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

	static get __noop() {
		return;
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
