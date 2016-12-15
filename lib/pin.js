const fs = require('fs');
const path = require('path');

module.exports = {
	pin: function(options) {
		if (err = this.verify()) return err;

		// Warn if we find an existing backup!
		var backup = path.join(process.cwd(), 'bower.json.bak');
		if (fs.existsSync(backup)) return 'ERROR: backup already exists; use --unpin or manually delete the backup';

		var dependencies = {};
		var files = fs.readdirSync(path.join(process.cwd(), 'bower_components'));
		for (var i = 0; i < files.length; ++i) {
			var json = path.join(process.cwd(), 'bower_components', files[i], '.bower.json');
			if (!fs.existsSync(json)) return 'ERROR: cannot find "bower_components/' + files[i] + '/.bower.json".';

			// We could use json.version, but that is undefined when we target a commit,
			// like we do for exif-js
			dependencies[files[i]] = JSON.parse(fs.readFileSync(json, 'utf8'))._release;
		}

		var contents = fs.readFileSync(path.join(process.cwd(), 'bower.json'), 'utf8');
		if (!options['dry-run']) {
			fs.writeFileSync(backup, contents);
		}

		var config = JSON.parse(contents);
		config.dependencies = dependencies;
		delete config.resolutions;

		if (!options['dry-run']) {
			fs.writeFileSync(path.join(process.cwd(), 'bower.json'), JSON.stringify(config, null, 2));
		}

		console.log('pinned');
	},

	unpin: function(options) {
		if (err = this.verify()) return err;

		var backup = path.join(process.cwd(), 'bower.json.bak');
		if (!fs.existsSync(backup)) return 'ERROR: cannot find "bower.json.bak".';

		if (!options['dry-run']) {
			fs.writeFileSync(path.join(process.cwd(), 'bower.json'), fs.readFileSync(backup));
			fs.unlinkSync(backup);
		}

		console.log('unpinned');
	},

	verify: function() {
		var paths = ['bower_components', 'bower.json'];
		for (var i = 0; i < paths.length; ++i) {
			if (!fs.existsSync(path.join(process.cwd(), paths[i]))) return 'ERROR: cannot find "' + paths[i] + '".';
		}
	}
};
