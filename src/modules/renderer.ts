import { ResourceOptions, Selector } from '../types';

/**
 * Handles the more mundane document tasks
 * - Tracks elements created by the loader
 * - Appends elements
 * - Does some light state management, using data-loader-*
 */
export default class Renderer {
	target: HTMLElement;
	#_elements: Set<HTMLElement>;
	constructor(target: HTMLElement) {
		this.target = target;
		this.#_elements = new Set();
	}

	/**
	 * Light state management
	 * - Add a data-loader-* attribute to a given element
	 * - Option to give a value to said attribute
	 */
	static update(el: HTMLElement, state: string, value?: any) {
		(el || document.body).dataset[state] = value || '';
		return el || document.body;
	}

	static has(el: HTMLElement, data: string) {
		return el.hasAttribute(data);
	}

	/**
	 * Appends element to this.target
	 * - Useful for one off element appending
	 * - Used by Renderer.appendAll
	 */
	append(el?: HTMLElement, position: InsertPosition = 'beforeend') {
		const insertAt = position;
		const htmlEl = el || this.#_elements.entries().next().value[0];

		try {
			const insertedElement = this.target.insertAdjacentElement(
				insertAt,
				htmlEl
			);
			if (insertedElement === null) throw Error();
		} catch (e) {
			Renderer.update(htmlEl, 'rlError', true);
			console.warn('Error: Could not insert element', {
				htmlEl,
				position,
			});
			const { name, message } = e;
			console.error('Full Error: ', { name, message });
		}
	}

	/**
	 * Loops through the created link/script elements
	 * - Uses Renderer.append to attach to this.target
	 */
	appendAll(position: InsertPosition = 'beforeend') {
		requestAnimationFrame(() =>
			this.#_elements.forEach(element => this.append(element, position))
		);
	}

	/**
	 * Proxy method for Set.add
	 */
	set add(el: HTMLElement) {
		this.#_elements.add(el);
	}

	/**
	 * Proxy method for Set.forEach
	 */
	forEach(
		cb: (
			value: HTMLElement,
			value2: HTMLElement,
			set: Set<HTMLElement>
		) => void
	) {
		this.#_elements.forEach(cb);
	}

	$(e: Selector, parent?: HTMLElement): HTMLElement[] {
		const check = e as any;
		if (check === null || ('length' in check && check.length === 0))
			return [];
		const el = e as Node;
		const list = e as NodeList;
		const selector = e as string;
		return el.nodeName
			? // a single element is wrapped in an array
			  [el]
			: // selector and NodeList are converted to Element[]
			  [].slice.call(
					list[0].nodeName
						? list
						: (parent || document).querySelectorAll(selector)
			  );
	}

	/**
	 * Creates a script/link element
	 * - Element is added to list
	 * - Later appended to the target
	 */
	render(
		resourceOptions: ResourceOptions,
		key: string,
		toPage: boolean = false
	) {
		const {
			skipCondition = null,
			skipCallback = () => {},
		} = resourceOptions;

		if (skipCondition !== null && skipCondition()) {
			return skipCallback();
		}

		const [type, name] = key.split(':');

		const options = Object.assign({ id: name }, resourceOptions);

		const element =
			type === 'js'
				? script(options as ResourceOptions)
				: link(options as ResourceOptions);

		Renderer.update(element, 'rlResource', key);

		if (toPage) return this.append(element, 'beforeend');
		this.add = element;

		function script(options: ResourceOptions) {
			const { url, id, async = false } = options;

			return Object.assign(
				document.createElement('script'),
				{ async: false, defer: false },
				{ src: url, async, id }
			);
		}

		function link(options: ResourceOptions) {
			const { url, id, async = false } = options;

			var assignObject = {
				href: url,
				media: 'all',
				id,
			};

			if (async) assignObject.media = 'print';

			const el = Object.assign(
				document.createElement('link'),
				{ rel: 'stylesheet' },
				assignObject
			);
			el.addEventListener(
				'load',
				() => ((this.onload = null), (this.media = 'all')),
				{ once: true, capture: false }
			);
			return el;
		}
	}
}
