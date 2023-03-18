@preprocessor typescript

@{%
import lexer  from './moo-lexer'
import * as ast from '../ast'
import { toASTNode, filterAndToASTNode, filterTemplateStringContent } from './utils'

const n = () => null;
%}

@lexer lexer
@include "./statement.ne"
@include "./common.ne"

main ->  null {% n %}
    | _ s_block {% ([, block]) => block %}
    | _ {% n %}
