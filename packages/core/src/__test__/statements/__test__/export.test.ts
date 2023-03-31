import { describe, it } from 'vitest';

import * as utils from '../../utils';
import { exportStatements } from '..';

describe('simple', () => {
  it('named', () => {
    exportStatements.simple.named.forEach(stmt => {
      utils.assertSource({
        content: stmt.content,
        nodes: [stmt.node]
      });
    });
  });

  it('multipleNamed', () => {
    exportStatements.simple.multipleNamed.forEach(stmt => {
      utils.assertSource({
        content: stmt.content,
        nodes: [stmt.node]
      });
    });
  });

  it('default', () => {
    exportStatements.simple.default.forEach(stmt => {
      utils.assertSource({
        content: stmt.content,
        nodes: [stmt.node]
      });
    });
  });

  it('re', () => {
    exportStatements.simple.re.forEach(stmt => {
      utils.assertSource({
        content: stmt.content,
        nodes: [stmt.node]
      });
    });
  });
});
