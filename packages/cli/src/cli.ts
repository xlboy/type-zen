import cac from 'cac';

import { version } from '../package.json';

const VERSION = version as string;

const cli = cac('tzc');

cli.help();
cli.version(VERSION);

cli.parse();
