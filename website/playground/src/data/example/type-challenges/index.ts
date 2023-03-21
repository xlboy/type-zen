import type { Example } from '../types';
import { tcEasyExample } from './easy';
import { tcMediumExample } from './medium';

export const typeChallengesExample = {
  key: 'type-challenges',
  name: 'Type Challenges',
  children: [tcEasyExample, tcMediumExample]
} as const satisfies Example.Index;
