#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var ERROR_BACKUP_NOT_FOUND = 1;
var ERROR_BOWER_CONFIG_NOT_FOUND = 2;
var ERROR_REPEAT_PIN = 3;

var dryrun = process.argv.indexOf('--dry-run') != -1;
var unpin = process.argv.indexOf('--unpin') != -1;

var backupPath = path.join(process.cwd(), 'bower.json.bak');

if (unpin) {
	if (!fs.existsSync(backupPath)) {
		console.error('ERROR: cannot find "' + backupPath + '".');
		process.exit(ERROR_BACKUP_NOT_FOUND);
	}

	if (!dryrun) {
		fs.writeFileSync(path.join(process.cwd(), 'bower.json'), fs.readFileSync(backupPath));
		fs.unlinkSync(backupPath);
	}
}
else {
	// Warn if we find an existing backup!
	if (fs.existsSync(backupPath)) {
		console.warn('ERROR: backup already exists; use --unpin or manually delete the backup');
		process.exit(ERROR_REPEAT_PIN);
	}

	var dependencies = {};
	var files = fs.readdirSync(path.join(process.cwd(), 'bower_components'));
	for (var i = 0; i < files.length; ++i) {
		var jsonPath = path.join(process.cwd(), 'bower_components', files[i], '.bower.json');
		if (!fs.existsSync(jsonPath)) {
			console.error('ERROR: cannot find "' + jsonPath + '".');
			process.exit(ERROR_BOWER_CONFIG_NOT_FOUND);
		}

		var contents = fs.readFileSync(jsonPath, 'utf8');
		var json = JSON.parse(contents);

		// We could use json.version, but that is undefined when we target a commit,
		// like we do for exif-js
		dependencies[files[i]] = json._release;
	}

	var contents = fs.readFileSync(path.join(process.cwd(), 'bower.json'), 'utf8');
	if (!dryrun) {
		fs.writeFileSync(backupPath, contents);
	}

	var config = JSON.parse(contents);
	config.dependencies = dependencies;
	delete config.resolutions;

	if (!dryrun) {
		fs.writeFileSync(path.join(process.cwd(), 'bower.json'), JSON.stringify(config, null, 2));
	}
}

console.log('success');