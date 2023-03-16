import { expect, it } from 'vitest';

import * as ast from '../../../ast';
import { Compiler } from '../../../compiler';
import { Parser } from '../../../parser';
import * as utils from '../../utils';
import { sugarBlockExpressions } from '..';

it('simple', () => {
  sugarBlockExpressions.simple.forEach(expr => {
    const node = utils.createNode({
      instance: ast.TypeAliasStatement,
      value: expr.node
    });

    if (expr.node.outputReg) {
      node.outputReg = new RegExp(`type B = ${expr.node.outputReg.source}`);
    }

    if (expr.node.outputStr) {
      node.outputStr = `type B = ${expr.node.outputStr}`;
    }

    utils.assertSource({
      content: `type B = ${expr.content}`,
      nodes: [node]
    });
  });
});

it('nested references to local variables to be promoted', () => {
  const content = `type B = ^{
    type FilterVal<N> = [N, 'filter']
    
    for (infer Item in '1' | '2') {
      return ['filtered ->', FilterVal<Item>]
    }
  }`;

  const compiledText = new Compiler().compile(new Parser().parse(content)!).toText();

  const [hoistedStmt, typeAliasBStmt] = compiledText.split('\n');

  const hoistedTypeAlias = hoistedStmt.match(/type (.+)</)?.[1];

  expect(hoistedStmt).toMatch(
    new RegExp(`type \\${hoistedTypeAlias}<N> = \\[N, 'filter'\\];`)
  );

  const sugarBlockOutputReg = `'1' | '2' extends infer Item ? \\['filtered ->', \\${hoistedTypeAlias}<Item>\\] : never;`;

  expect(typeAliasBStmt).toMatch(new RegExp(sugarBlockOutputReg));
});

it('reference brother - local variable', () => {
  const content = `
  type T = ^{
    type MyName = "xlboy";
    type TeamMembers = [MyName, "Other"];
  
    return [true]
  }
  `;
  const compiledText = new Compiler().compile(new Parser().parse(content)!).toText();

  expect(compiledText).toBe(
    'type T = ["xlboy", ["xlboy", "Other"]] extends [infer MyName, infer TeamMembers] ? [true] : never;'
  );
});
