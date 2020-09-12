import { ResourceOptions, ResourceDependency } from '../types';
import { ControllerError } from './errors';

/**
 * Controller for tracking resource options
 * - Find a specific option object
 * - Loop through all stored options
 */
export default class Controller {
	#_list: Map<string, ResourceOptions>;
	#_dependencies: Map<string, ResourceDependency[]>;
	constructor(resources: [string, ResourceOptions][]) {
		this.#_list = new Map(resources);
		this.#_dependencies = new Map();
	}

	fulfill(key: string) {
		const toResolve = [];
		this.#_dependencies.forEach((dependencies, resourceKey) => {
			dependencies.forEach(dependencyObject => {
				if (dependencyObject[key] === undefined) return;
				dependencyObject[key].fulfilled = true;
			});
			const resolvedKey = this.resolve(resourceKey, dependencies);
			if (resolvedKey !== undefined) toResolve.push(resolvedKey);
		});

		return toResolve;

		// this.#_dependencies.forEach(resourceDependencies => resourceDependencies[key].fulfilled = true);
	}

	resolve(resourceKey: string, dependencyList: ResourceDependency[]) {
		const dependencies = dependencyList.values();

		let currDep = dependencies.next(),
			currVal = currDep.value,
			done = currDep.done;
		let depLength = 0,
			fulfilledLength = 0;

		while (currVal !== undefined && !done) {
			depLength += 1;

			const entries = Object.entries(currVal)[0];
			var status: { fulfilled?: boolean; error?: boolean } = entries[1];

			if (status.fulfilled === true) fulfilledLength += 1;

			currDep = dependencies.next();
			currVal = currDep.value;
			done = currDep.done;
		}

		if (depLength === fulfilledLength) {
			return resourceKey;
		}
	}

	depToArr(str: string) {
		return str.indexOf(',') > 0 ? str.split(',') : [str];
	}

	/**
	 * Proxy method for Map.set
	 */
	add(key: string, config: ResourceOptions) {
		this.#_list.set(key, config);
	}

	define(key: string, deps: string[]) {
		const value: ResourceDependency[] = [];
		deps.forEach(dep => {
			value.push({
				[dep]: {
					fulfilled: false,
					error: false,
				},
			});
			this.#_dependencies.set(key, value);
		});
	}
	/*
	redefine(key: string, update: { dep: string, fulfilled?: boolean, error?: boolean }) {
		const currValue = this.#_dependencies.get({ key });
		const dep = update.dep;
		const {
			fulfilled = currValue[dep].fulfilled,
			error = currValue[dep].error,
		} = update;
		currValue[dep] = Object.assign(currValue[dep], { fulfilled, error })

		this.#_dependencies.set({ key }, currValue);
	}
	*/

	/**
	 * Finds a ResourceOptions object give a key
	 * - Key format: js:jquery, css:bootstrap
	 * - Throws an error if a key does not exist
	 */
	find(key: string): ResourceOptions {
		const iterator = this.#_list.keys();
		var { value, done } = iterator.next();

		// while the key hasn't been found
		// and the iterator is not finished
		while (value !== key && !done) {
			let next = iterator.next();
			value = next.value;
			done = next.done;
		}
		if (value !== key)
			throw new ControllerError('The key ' + key + ' does not exist.');

		return this.getOption(key);
	}

	/**
	 * Gets a ResourceOptions object given a key
	 * - Throws an error if the Controller nothing is found
	 */
	getOption(mapKey: string) {
		const option = this.#_list.get(mapKey);
		if (option === undefined)
			throw ControllerError(
				'The Manager found no resources',
				null,
				mapKey
			);
		return option;
	}

	/*
	resolve(key) {
		this.#_dependencies
	}
	*/

	/**
	 * Proxy method for Map.forEach
	 */
	forEach(
		cb: (
			value: ResourceOptions,
			key: string,
			map: Map<string, ResourceOptions>
		) => void
	) {
		this.#_list.forEach(cb);
	}

	/**
	 * Proxy method for accessing the list of resources
	 */
	resources() {
		return this.#_list;
	}
}
