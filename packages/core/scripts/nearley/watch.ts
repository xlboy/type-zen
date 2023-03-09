import watch from 'node-watch';

import { build } from './build';

build();

watch('src/grammar/', { recursive: true, filter: /.ne$/ }, build);
