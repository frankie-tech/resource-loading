import { ResourceOptions, ResourceConfigs, Selector } from './types';
import { extendEvent, trueType } from './modules/utils';
import Controller from './modules/controller';
import Renderer from './modules/renderer';
// Globals
declare global {
	interface Window {
		LoaderConfigs: ResourceConfigs;
	}
}
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
	_configs: ResourceConfigs;
	controller: Controller;
	elements: Renderer;
	// prettier-ignore
	constructor(defaults: [string, ResourceOptions][], configs: ResourceConfigs) {
		this._configs = Object.assign(window.LoaderConfigs || {}, configs);
		this.controller = new Controller(defaults);
		this.elements = new Renderer(document.head);
		Renderer.update(document.body, 'rlComplete', false);
	}

	handleLoad(event: Event) {
		const target = event.target as HTMLElement;

		if (Renderer.has(target, 'data-rl-resource') !== true) return;
		var resolved;
		try {
			var key = target.dataset.rlResource;
			const options = this.controller.find(key);

			if (trueType(options) === 'Object' && 'callback' in options) {
				options.callback();
				Renderer.update(target, 'rlCallback', 'success');
			}
			resolved = this.controller.fulfill(key);
			Renderer.update(target, 'rlState', 'loading');
		} catch (err) {
			console.warn(
				'There was an error with loading resource named: ' + key
			);
			console.error(err);
		} finally {
			Renderer.update(target, 'rlState', 'complete');
			if (resolved.length !== 0)
				resolved.forEach(key => {
					this.elements.render(this._configs[key], key, true);
				});
		}
	}

	init() {
		// this.dependencies = dependencyList || document.body;

		try {
			this.resources.forEach((options: ResourceOptions, key: string) =>
				this.elements.render(options, key)
			);
			document.head.addEventListener(
				'load',
				event => this.handleLoad(event),
				true
			);
			this.elements.append();
		} catch (err) {
			console.error(err);
		} finally {
			Renderer.update(document.body, 'rlComplete', true);
		}
	}

	get resources() {
		const resourceDeps =
			Renderer.has(document.body, 'data-rl-dependencies') &&
			document.body.dataset.rlDependencies;
		const resourceDepArr =
			resourceDeps.indexOf(',') > 0
				? resourceDeps.split(',')
				: [resourceDeps];
		resourceDepArr.forEach(key => {
			const resourceConfig = this._configs[key];
			if ('deps' in resourceConfig) {
				const deps =
					resourceConfig.deps.indexOf(',') > 0
						? resourceConfig.deps.split(',')
						: [resourceConfig.deps];

				return this.controller.define(key, deps);
			}
			this.controller.add(key, resourceConfig);
		});

		return this.controller.resources();
	}

	/*
	set dependencies(el: HTMLElement) {
		const resources = el.hasAttribute('data-rl-dependencies') && el.dataset.rlDependencies;
		if (!resources) {
			this._dependencies = []
			return;
		}

		if (resources.indexOf(',') > 0) {
			this._dependencies = resources.split(',');
			return;
		}

		this._dependencies = [resources];
	}

	// adds resources from an elements 'data-resources' to the configs attribute
	get resources() {
		this._dependencies.forEach(resource => {
			const config = this._configs[resource];
			this.controller.add(resource, config);
		});

		return this.controller.resources();
	}
	*/
}
