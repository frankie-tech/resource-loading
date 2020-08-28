interface ResourceOptions {
	url: string;
	id?: string;
	callback?: Function;
	skipCondition?: Function;
	skipCallback?: Function;
}

interface ResourceDefaults {}

interface ResourceConfigs<
	Props extends { [key: string]: unknown },
	Value extends { [key: string]: unknown }
> extends Map<keyof Props, Props[keyof Value]> {
	get<K extends keyof Props, V extends keyof Value>(key: K): Props[V];
}

export { ResourceConfigs, ResourceOptions };
