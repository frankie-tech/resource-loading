import { chromium } from 'playwright';
import { test } from 'uvu';
import * as assert from 'uvu/assert';

import ResourceLoader from '../dist/loader.modern';
var browser;

const browserOn = async () => {};

const defaults = [
	[
		'js:test',
		{
			url: '/assets/product/url.js',
		},
	],
];

test('Config is stored in resources', () => {
	const rl = new ResourceLoader(defaults, {});

	assert.equal(
		rl.resources,
		new Map([['js:test', { url: '/assets/product/url.js' }]])
	);

	assert.equal(rl.configs, {});

	assert.equal(rl.resources.get('js:test'), {
		url: '/assets/product/url.js',
	});
});

test('Resource is rendered', async () => {
	const rl = new ResourceLoader(defaults, {});

	browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto('http://localhost:8000');
	rl.init();
});

const browserOff = async () => browser.close();

browserOn();
test.run();
browserOff();
