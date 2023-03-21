import type { Example } from '../../types';

export const tcEasyExample = {
  key: 'type-challenges-easy',
  name: 'Easy',
  children: [
    {
      key: 'type-challenges-easy-1_pick',
      name: '1 - Pick',
      zenCode: `
type MyPick<T, K: keyof T> = {
  [key in K]: T[key]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
`
    }
  ]
} as const satisfies Example.Index;
