export interface LetterData {
  id: string
  upper: string
  lower: string
  phonetic: string
  word: string
  meaning: string
  emoji: string
}

export const letters: LetterData[] = [
  { id: 'a', upper: 'A', lower: 'a', phonetic: '/eɪ/', word: 'Apple', meaning: '苹果', emoji: '🍎' },
  { id: 'b', upper: 'B', lower: 'b', phonetic: '/biː/', word: 'Ball', meaning: '球', emoji: '⚽' },
  { id: 'c', upper: 'C', lower: 'c', phonetic: '/siː/', word: 'Cat', meaning: '猫', emoji: '🐱' },
  { id: 'd', upper: 'D', lower: 'd', phonetic: '/diː/', word: 'Dog', meaning: '狗', emoji: '🐶' },
  { id: 'e', upper: 'E', lower: 'e', phonetic: '/iː/', word: 'Elephant', meaning: '大象', emoji: '🐘' },
  { id: 'f', upper: 'F', lower: 'f', phonetic: '/ɛf/', word: 'Fish', meaning: '鱼', emoji: '🐟' },
  { id: 'g', upper: 'G', lower: 'g', phonetic: '/dʒiː/', word: 'Girl', meaning: '女孩', emoji: '👧' },
  { id: 'h', upper: 'H', lower: 'h', phonetic: '/eɪtʃ/', word: 'Hat', meaning: '帽子', emoji: '🎩' },
  { id: 'i', upper: 'I', lower: 'i', phonetic: '/aɪ/', word: 'Ice cream', meaning: '冰淇淋', emoji: '🍦' },
  { id: 'j', upper: 'J', lower: 'j', phonetic: '/dʒeɪ/', word: 'Juice', meaning: '果汁', emoji: '🧃' },
  { id: 'k', upper: 'K', lower: 'k', phonetic: '/keɪ/', word: 'Kite', meaning: '风筝', emoji: '🪁' },
  { id: 'l', upper: 'L', lower: 'l', phonetic: '/ɛl/', word: 'Lion', meaning: '狮子', emoji: '🦁' },
  { id: 'm', upper: 'M', lower: 'm', phonetic: '/ɛm/', word: 'Monkey', meaning: '猴子', emoji: '🐵' },
  { id: 'n', upper: 'N', lower: 'n', phonetic: '/ɛn/', word: 'Nose', meaning: '鼻子', emoji: '👃' },
  { id: 'o', upper: 'O', lower: 'o', phonetic: '/oʊ/', word: 'Orange', meaning: '橙子', emoji: '🍊' },
  { id: 'p', upper: 'P', lower: 'p', phonetic: '/piː/', word: 'Pig', meaning: '猪', emoji: '🐷' },
  { id: 'q', upper: 'Q', lower: 'q', phonetic: '/kjuː/', word: 'Queen', meaning: '女王', emoji: '👑' },
  { id: 'r', upper: 'R', lower: 'r', phonetic: '/ɑr/', word: 'Rabbit', meaning: '兔子', emoji: '🐰' },
  { id: 's', upper: 'S', lower: 's', phonetic: '/ɛs/', word: 'Sun', meaning: '太阳', emoji: '☀️' },
  { id: 't', upper: 'T', lower: 't', phonetic: '/tiː/', word: 'Tree', meaning: '树', emoji: '🌳' },
  { id: 'u', upper: 'U', lower: 'u', phonetic: '/juː/', word: 'Umbrella', meaning: '雨伞', emoji: '☂️' },
  { id: 'v', upper: 'V', lower: 'v', phonetic: '/viː/', word: 'Violin', meaning: '小提琴', emoji: '🎻' },
  { id: 'w', upper: 'W', lower: 'w', phonetic: '/dʌbəl juː/', word: 'Water', meaning: '水', emoji: '💧' },
  { id: 'x', upper: 'X', lower: 'x', phonetic: '/ɛks/', word: 'Xylophone', meaning: '木琴', emoji: '🎹' },
  { id: 'y', upper: 'Y', lower: 'y', phonetic: '/waɪ/', word: 'Yoyo', meaning: '悠悠球', emoji: '🪀' },
  { id: 'z', upper: 'Z', lower: 'z', phonetic: '/ziː/', word: 'Zebra', meaning: '斑马', emoji: '🦓' },
]
