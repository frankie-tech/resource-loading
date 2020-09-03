type ResourceOptions = {
	url: string;
	id?: string;
	callback?: Function;
	skipCondition?: Function;
	skipCallback?: Function;
};

interface ResourceDefaults {}

type ResourceConfigs = {
	[key: string]: ResourceOptions;
};

export { ResourceConfigs, ResourceOptions };
