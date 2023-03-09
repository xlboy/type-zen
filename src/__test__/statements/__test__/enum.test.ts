import { it } from 'vitest';

import * as utils from '../../utils';
import { enumStatements } from '..';

it('normal', () => {
  enumStatements.forEach(stmt => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node]
    });
  });
});
