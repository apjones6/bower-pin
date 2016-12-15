#!/usr/bin/env node

const commandLine = require('./lib/command-line');
const pin = require('./lib/pin');

const options = commandLine.getOptions();
if (options.help) {
	commandLine.showHelp();
}
else if (options.unpin) {
	if (err = pin.unpin(options)) {
		console.error(err);
		process.exit(1);
	}
}
else {
	if (err = pin.pin(options)) {
		console.error(err);
		process.exit(1);
	}
}
