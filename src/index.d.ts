type ResourceOptions = {
	url: string;
	id?: string;
	callback?: Function;
	skipCondition?: () => boolean;
	skipCallback?: Function;
	async?: boolean;
	defer?: boolean;
};

interface ResourceDefaults {}

type ResourceConfigs = {
	[key: string]: ResourceOptions;
};

export { ResourceConfigs, ResourceOptions };
