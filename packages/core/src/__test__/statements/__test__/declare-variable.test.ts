import { it } from 'vitest';

import * as utils from '../../utils';
import { declareVariableStatements } from '..';

it('normal', () => {
  declareVariableStatements.forEach(stmt => {
    utils.assertSource({
      content: stmt.content,
      nodes: [stmt.node]
    });
  });
});
