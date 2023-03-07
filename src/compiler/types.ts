import type { ASTNodePosition } from '../ast';

export type { CompiledNode, CompilerConfig };

interface CompiledNode {
  text: string;
  pos: {
    result?: ASTNodePosition;
    source?: ASTNodePosition;
  };
}

interface CompilerConfig {
  /**
   * 是否在每行末尾添加分号
   * @default true
   */
  useLineTerminator?: boolean;

  /**
   * 成员分隔符
   * @default ";"
   */
  memberSeparator?: ',' | ';' | false;
  /**
   * 缩进字符数
   * @default 2
   */
  indent?: number;
}
