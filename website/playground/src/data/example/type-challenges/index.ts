import type { Example } from '../types';
import { tcEasyExample } from './easy';

export const typeChallengesExample = {
  key: 'type-challenges',
  name: 'Type Challenges',
  children: [tcEasyExample]
} as const satisfies Example.Index;
