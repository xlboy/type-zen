import { it } from 'vitest';

import * as utils from '../../utils';
import { interfaceStatements } from '..';

it('normal', () => {
  interfaceStatements.forEach(stmt => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node]
    });
  });
});
