const path = require('path')
const { spawn } = require('child_process')
const electron = require('electron')
const puppeteer = require('puppeteer-core')
const axios = require("axios")

let child = null
const electronPath = typeof (electron) === 'string' ? electron : electron.app.getPath('exe')
console.log(electronPath);
const launch = options => {
	options = options || {}
	const env = Object.assign({}, options.env || process.env)
	if ('ELECTRON_RUN_AS_NODE' in env) delete env.ELECTRON_RUN_AS_NODE
	if (!('headless' in options)) options.headless = true
	console.log(path.join(__dirname, 'main.js'));
	//const args = ['/home/lauxinyi/Desktop/GO/spider/electron-spider/src/puppeteer-electron/main.js', JSON.stringify(options)]
	let mainJs=path.join(__dirname, 'main.js');
	console.log(process.platform);
	if (process.platform != 'win32') {
		mainJs = '/home/lauxinyi/Desktop/GO/spider/electron-spider/src/puppeteer-electron/main.js';
	}else{
		mainJs = "C:\\Users\\lauxinyi\\Desktop\\WWW\\V5_DataCollection\\electron-spider\\src\\puppeteer-electron\\main.js";
	}
	const args = [mainJs, '--remote-debugging-port=8315', JSON.stringify(options)]
	let promiseLaunch = new Promise(resolve => {
		child = spawn(electronPath, args, { env })
		child.stdout.on('data', (data) => {
			if (data.toString() === 'ready') {
				console.log("ready:111")
				resolve("start");
			}
		});
	});
	return promiseLaunch;
}


const patch = browser =>
	new Proxy(browser, {
		get: (target, key, receiver) =>
			key === 'close'
				? () => target.close().then(() => child && child.kill())
				: Reflect.get(target, key, receiver),
		set: (target, key, value, receiver) =>
			Reflect.set(target, key, value, receiver)
	});


module.exports.launch = options => {
	const { slowMo, defaultViewport } = Object.assign({ defaultViewport: null }, options || {})
	return Promise.resolve()
		.then(() => launch(options))
		.then(async () => {
			let ret = await axios.get("http://127.0.0.1:8315/json/version");
			let browserWSEndpoint = ret.data.webSocketDebuggerUrl;
			// let browser = puppeteer.connect({ browserURL: 'http://127.0.0.1:8315', slowMo, defaultViewport })
			console.log(defaultViewport);
			let browser = await puppeteer.connect({ browserWSEndpoint, slowMo, defaultViewport })
			return browser;
		})
		.then(browser => patch(browser))
}