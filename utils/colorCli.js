const chalk = require('chalk');

exports.error = chalk.bold.red;
exports.warning = chalk.yellow;
exports.success = chalk.bold.green;
exports.extra = chalk.blueBright;
exports.debug = chalk.bold.rgb(138,180,238);
