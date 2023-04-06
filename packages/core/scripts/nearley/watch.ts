import chokidar from 'chokidar';

import { build } from './build';

chokidar.watch('src/grammar/**/*.ne', { ignoreInitial: true }).on('all', () => {
  build();
});
