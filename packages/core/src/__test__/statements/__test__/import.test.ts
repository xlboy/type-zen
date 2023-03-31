import { it } from 'vitest';

import * as utils from '../../utils';
import { importStatements } from '..';

it('simple', () => {
  importStatements.simple.forEach(stmt => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node]
    });
  });
});
