type ResourceOptions = {
	url: string;
	id?: string;
	deps?: string;
	callback?: Function;
	skipCondition?: () => boolean;
	skipCallback?: Function;
	async?: boolean;
	loaded?: boolean;
};

interface ResourceDefaults {}

type ResourceConfigs = {
	[key: string]: ResourceOptions;
};

type ResourceDependency = {
	[key: string]: {
		fulfilled: boolean;
		error: boolean;
	};
};

export { ResourceConfigs, ResourceOptions, ResourceDependency };

// Useful/Multipurpose types

type Selector = string | Node | NodeList | Element[];

export { Selector };
