const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const optionDefinitions = [{
	name: 'unpin',
	description: 'Removes an existing bower pin',
	alias: 'u',
	type: Boolean
}, {
	name: 'commit',
	description: 'Use commit SHAs for all versions',
	alias: 'c',
	type: Boolean
}, {
	name: 'dry-run',
	description: 'Executes a dry run, without making any changes',
	alias: 'n',
	type: Boolean
}, {
	name: 'help',
	description: 'Displays this help',
	alias: 'h',
	type: Boolean
}];

module.exports = {
	getOptions: function() {
		return commandLineArgs(optionDefinitions);
	},

	showHelp: function() {
		console.log(commandLineUsage([{
			header: 'bower-pin',
			content: 'A simple utility which updates bower.json dependencies to the locally installed versions.'
		}, {
			header: 'Options',
			optionList: optionDefinitions
		}, {
			content: 'Project home: [underline]{https://github.com/apjones6/bower-pin}'
		}]));
	}
};
