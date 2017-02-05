const fs = require('fs');
const path = require('path');

module.exports = {
	pin: function(options) {
		if (err = this.verify(['bower_components', 'bower.json'])) return err;

		// Warn if we find an existing backup!
		var backup = path.join(process.cwd(), 'bower.json.bak');
		if (fs.existsSync(backup)) return 'ERROR: backup already exists; use --unpin or manually delete the backup';

		var dependencies = {};
		var files = fs.readdirSync(path.join(process.cwd(), 'bower_components'));
		for (var i = 0; i < files.length; ++i) {
			var jsonPath = path.join(process.cwd(), 'bower_components', files[i], '.bower.json');
			if (!fs.existsSync(jsonPath)) return 'ERROR: cannot find "bower_components/' + files[i] + '/.bower.json".';

			// We could use json.version, but that is undefined when we target a commit,
			// like we do for exif-js
			var json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
			dependencies[files[i]] = options['commit'] ? json._resolution.commit : json._release;
		}

		var contents = fs.readFileSync(path.join(process.cwd(), 'bower.json'), 'utf8');
		if (!options['dry-run']) {
			fs.writeFileSync(backup, contents);
		}

		var config = JSON.parse(contents);
		config.dependencies = dependencies;

		// If the config has any resolutions set them too, or set all dependencies
		// if using --commit flag, as inner dependencies will conflict
		if (config.resolutions) {
			if (options['commit']) {
				config.resolutions = config.dependencies;
			}
			else {
				for (var key in config.resolutions) {
					if (config.resolutions.hasOwnProperty(key)) {
						config.resolutions[key] = config.dependencies[key];
					}
				}
			}
		}

		if (!options['dry-run']) {
			fs.writeFileSync(path.join(process.cwd(), 'bower.json'), JSON.stringify(config, null, 2));
		}

		console.log('pinned');
	},

	unpin: function(options) {
		if (err = this.verify(['bower.json', 'bower.json.bak'])) return err;

		var backup = path.join(process.cwd(), 'bower.json.bak');

		if (!options['dry-run']) {
			fs.writeFileSync(path.join(process.cwd(), 'bower.json'), fs.readFileSync(backup));
			fs.unlinkSync(backup);
		}

		console.log('unpinned');
	},

	verify: function(paths) {
		for (var i = 0; i < paths.length; ++i) {
			if (!fs.existsSync(path.join(process.cwd(), paths[i]))) return 'ERROR: cannot find "' + paths[i] + '".';
		}
	}
};
