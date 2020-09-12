function extendEvent(
	type: string,
	originalEvent: Event,
	detail: object
): CustomEvent {
	const { bubbles, cancelable, composed } = event || {
		bubbles: true,
		cancelable: true,
		composed: true,
	};

	if (event) {
		Object.assign(detail, { originalEvent });
	}

	const customEvent = new CustomEvent(type, {
		bubbles,
		cancelable,
		composed,
		detail,
	});
	return customEvent;
}

function trueType(variable: any): string {
	return Object.prototype.toString.call(variable).slice(8, -1);
}

export { extendEvent, trueType };
