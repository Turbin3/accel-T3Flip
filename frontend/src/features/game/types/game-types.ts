export interface Person {
  id: number
  name: string
  imageUrl: string
  hints: string[]
}

export interface Card {
  id: number
  personId: number
  isRevealed: boolean
  isGuessed: boolean
}

export interface GameState {
  cards: Card[]
  availablePersons: Person[]
  currentCardIndex: number
  errors: number
  maxErrors: number
  isStarted: boolean
  isComplete: boolean
  isWon: boolean
}

export const MOCK_PERSONS: Person[] = [
  {
    id: 1,
    name: 'Linus Torvalds',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linus',
    hints: [
      'Created a widely-used operating system kernel',
      'Also created a distributed version control system',
    ],
  },
  {
    id: 2,
    name: 'Grace Hopper',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=grace',
    hints: [
      'Pioneered computer programming',
      'Popularized the term "debugging"',
    ],
  },
  {
    id: 3,
    name: 'Tim Berners-Lee',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tim',
    hints: [
      'Invented the World Wide Web',
      'Created the first web browser',
    ],
  },
  {
    id: 4,
    name: 'Ada Lovelace',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ada',
    hints: [
      'Considered the first computer programmer',
      'Worked on the Analytical Engine',
    ],
  },
  {
    id: 5,
    name: 'Dennis Ritchie',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dennis',
    hints: [
      'Created the C programming language',
      'Co-created Unix operating system',
    ],
  },
  {
    id: 6,
    name: 'Margaret Hamilton',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=margaret',
    hints: [
      'Led software team for Apollo missions',
      'Coined the term "software engineering"',
    ],
  },
  {
    id: 7,
    name: 'Guido van Rossum',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guido',
    hints: [
      'Created a popular high-level programming language',
      'Known for emphasizing code readability',
    ],
  },
  {
    id: 8,
    name: 'Bjarne Stroustrup',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bjarne',
    hints: [
      'Created C++ programming language',
      'Extended C with object-oriented features',
    ],
  },
  {
    id: 9,
    name: 'James Gosling',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    hints: [
      'Created Java programming language',
      'Known for "write once, run anywhere"',
    ],
  },
  {
    id: 10,
    name: 'Ken Thompson',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ken',
    hints: [
      'Co-created Unix operating system',
      'Created the B programming language',
    ],
  },
  {
    id: 11,
    name: 'Brendan Eich',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=brendan',
    hints: [
      'Created JavaScript in 10 days',
      'Co-founded Mozilla',
    ],
  },
  {
    id: 12,
    name: 'Alan Turing',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alan',
    hints: [
      'Father of computer science and AI',
      'Created the Turing machine concept',
    ],
  },
  {
    id: 13,
    name: 'Donald Knuth',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=donald',
    hints: [
      'Author of "The Art of Computer Programming"',
      'Created TeX typesetting system',
    ],
  },
  {
    id: 14,
    name: 'John Carmack',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    hints: [
      'Pioneer in 3D graphics programming',
      'Co-founded id Software',
    ],
  },
  {
    id: 15,
    name: 'Vitalik Buterin',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vitalik',
    hints: [
      'Co-founded Ethereum blockchain',
      'Pioneered smart contracts platform',
    ],
  },
]
