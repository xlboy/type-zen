import _ from 'lodash-es';
import { it } from 'vitest';

import * as ast from '../../../ast';
import * as utils from '../../utils';

it('new line', () => {
  utils.assertSource({
    content: `
    // aaa
    /*
    123123
    sdfsdf

    /sdfsdf/

    12
    */
    type B = 1
    // /////.................................kjl

    // ???????????

    /* ------------- */

    // 92349324OOOOOOOOOOOOOOOOOOOOOOo

    `,

    nodes: [
      utils.createNode({
        instance: ast.TypeAliasStatement,
        outputStr: `type B = 1`
      })
    ]
  });
});

it('inline', () => {
  utils.assertSource({
    content: `
    /* ------------- */

    /* ------------- */
    type/* ?? */B/* 3 */=/* 592304
    
    */ [{/* ... */ },/* ??1239391239 */ 1,/* ... */ 3/* ............... */]
    // /////.................................kjl

    // ???????????

    /* ------------- */

    // 92349324OOOOOOOOOOOOOOOOOOOOOOo

    `,

    nodes: [
      utils.createNode({
        instance: ast.TypeAliasStatement,
        outputStr: `type B = [{}, 1, 3]`
      })
    ]
  });
});
