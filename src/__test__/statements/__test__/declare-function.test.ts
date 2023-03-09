import { it } from 'vitest';

import * as utils from '../../utils';
import { declareFunctionStatements } from '..';

it('normal', () => {
  declareFunctionStatements.forEach(stmt => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node]
    });
  });
});
