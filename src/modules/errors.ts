import ResourceOptions from '..';

function CustomError(...args: (string | HTMLElement)[]) {
	const [message, el] = args;
	this.message = message as string;
	this.el = el as HTMLElement;
	this.constructor.prototype = extender(this, Error);
	return;
}
// reverse engineered from this https://github.com/loganfsmyth/babel-plugin-transform-builtin-extend
function extender(base: Function, extend: ArrayLike<any> | Iterable<any>) {
	function reflect() {
		const instance = Reflect.construct(
			base.constructor,
			Array.from(extend)
		);
		Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
		return instance;
	}

	reflect.prototype = Object.create(base.constructor.prototype, {
		constructor: {
			value: base,
			enumerable: false,
			writable: true,
			configurable: true,
		},
	});

	reflect.prototype[Symbol.species] = function () {
		return base.constructor;
	};

	if (Object.setPrototypeOf) {
		Object.setPrototypeOf(reflect, base);
	}

	return reflect;
}

function ResourceMissingError(message: string, el: HTMLElement) {
	this.constructor.prototype = extender(this, CustomError);
}

function ManagerNotFoundError(message: string, key: string) {
	this.key = key;
	this.constructor.prototype = extender(this, CustomError);
}

function ControllerError(
	message: string,
	option?: string | null,
	key?: string | null,
	resource?: ResourceOptions | null
) {
	this.message = message || '';
	this.option = option || null;
	this.key = key || null;
	this.resource = resource || null;
	this.constructor.prototype = extender(this, CustomError);
}

export { ResourceMissingError, ControllerError, CustomError };
