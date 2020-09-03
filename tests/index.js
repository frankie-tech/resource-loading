import { test } from 'uvu';
import * as assert from 'uvu/assert';

import ResourceLoader from '../dist/loader.modern';

test('Config is read', () => {
	const defaults = [
		[
			'js:test',
			{
				url: '/assets/product/url.js',
			},
		],
	];

	const rl = new ResourceLoader(defaults, {});
	console.log(rl.resources);
	assert.is(rl.init(), true);
});

test.run();
