# bower-pin

A simple utility which updates bower.json dependencies to the locally installed
versions. A backup is maintained, and a similar command reverts to the backed up
file.

## Why would I want this?

To simplify development we like to use version ranges for dependencies, so that
we can get fixes without having to monitor our dependencies manually. However
when we issue a tag for our code it can be useful to have absolute confidence if
we need to come back to it we won't pull in any problematic updates created
since the tag was issued.

This utility enables developers to pin dependencies when they issue a tag, and
easily restore the configuration for continuing development.

## How do I use it?

Simply globally install this utility to make it available to use in any of your
repositories. This isn't yet an npm package, but you can clone it and install
there for now.

	git clone git@github.com:apjones6/bower-pin.git
	cd bower-pin
	npm install -g

You can then from any bower repository use the command `bower-pin` to pin that
repository. This will update your bower.json file, and add a bower.json.bak. It
is recommended to .gitignore this file as you generally don't want it versioned.

Once you have issued your tag and want to restore your bower.json file, simply
execute `bower-pin --unpin` (or `bower-pin -u`), which will also remove the
backup.

All commands support a dry run by including the `--dry-run` or `-n` parameter.

## Looking ahead

One obvious feature to enhance this utility with would be checking the available
dependency versions, rather than relying on local ones. This enables scenarios
where a build server is used, as the local dependencies may be out of date, and
not match those installed by the version used.

The current version will remove resolutions from the bower.json when it pins to
avoid conflicts, however it doesn't recognize when the resolution is necessary.
It should detect these scenarios and add the resolution to the exact installed
versions.
