export interface PhoneticSymbol {
  symbol: string
  type: 'vowel' | 'consonant'
  description: string
  examples: { word: string; phonetic: string }[]
}

export const phonetics: PhoneticSymbol[] = [
  // Vowels
  { symbol: 'iː', type: 'vowel', description: '长音"衣"', examples: [{ word: 'see', phonetic: '/siː/' }, { word: 'eat', phonetic: '/iːt/' }, { word: 'green', phonetic: '/ɡriːn/' }] },
  { symbol: 'ɪ', type: 'vowel', description: '短音"衣"', examples: [{ word: 'sit', phonetic: '/sɪt/' }, { word: 'big', phonetic: '/bɪɡ/' }, { word: 'fish', phonetic: '/fɪʃ/' }] },
  { symbol: 'eɪ', type: 'vowel', description: '"哎"长音', examples: [{ word: 'make', phonetic: '/meɪk/' }, { word: 'day', phonetic: '/deɪ/' }, { word: 'name', phonetic: '/neɪm/' }] },
  { symbol: 'ɛ', type: 'vowel', description: '短音"哎"', examples: [{ word: 'red', phonetic: '/rɛd/' }, { word: 'bed', phonetic: '/bɛd/' }, { word: 'get', phonetic: '/ɡɛt/' }] },
  { symbol: 'æ', type: 'vowel', description: '大口"爱"', examples: [{ word: 'cat', phonetic: '/kæt/' }, { word: 'hat', phonetic: '/hæt/' }, { word: 'apple', phonetic: '/ˈæpəl/' }] },
  { symbol: 'ɑr', type: 'vowel', description: '"阿儿"', examples: [{ word: 'car', phonetic: '/kɑr/' }, { word: 'star', phonetic: '/stɑr/' }, { word: 'arm', phonetic: '/ɑrm/' }] },
  { symbol: 'ɔr', type: 'vowel', description: '"奥儿"', examples: [{ word: 'for', phonetic: '/fɔr/' }, { word: 'more', phonetic: '/mɔr/' }, { word: 'door', phonetic: '/dɔr/' }] },
  { symbol: 'oʊ', type: 'vowel', description: '"欧"长音', examples: [{ word: 'go', phonetic: '/ɡoʊ/' }, { word: 'home', phonetic: '/hoʊm/' }, { word: 'no', phonetic: '/noʊ/' }] },
  { symbol: 'uː', type: 'vowel', description: '长音"乌"', examples: [{ word: 'blue', phonetic: '/bluː/' }, { word: 'food', phonetic: '/fuːd/' }, { word: 'moon', phonetic: '/muːn/' }] },
  { symbol: 'ʊ', type: 'vowel', description: '短音"乌"', examples: [{ word: 'book', phonetic: '/bʊk/' }, { word: 'good', phonetic: '/ɡʊd/' }, { word: 'put', phonetic: '/pʊt/' }] },
  { symbol: 'ʌ', type: 'vowel', description: '短音"啊"', examples: [{ word: 'cup', phonetic: '/kʌp/' }, { word: 'sun', phonetic: '/sʌn/' }, { word: 'bus', phonetic: '/bʌs/' }] },
  { symbol: 'ə', type: 'vowel', description: '弱音"厄"', examples: [{ word: 'about', phonetic: '/əˈbaʊt/' }, { word: 'banana', phonetic: '/bəˈnænə/' }, { word: 'sofa', phonetic: '/ˈsoʊfə/' }] },
  // Consonants
  { symbol: 'b', type: 'consonant', description: '浊音"波"', examples: [{ word: 'big', phonetic: '/bɪɡ/' }, { word: 'book', phonetic: '/bʊk/' }, { word: 'baby', phonetic: '/ˈbeɪbi/' }] },
  { symbol: 'p', type: 'consonant', description: '清音"泼"', examples: [{ word: 'pen', phonetic: '/pɛn/' }, { word: 'apple', phonetic: '/ˈæpəl/' }, { word: 'up', phonetic: '/ʌp/' }] },
  { symbol: 'd', type: 'consonant', description: '浊音"得"', examples: [{ word: 'dog', phonetic: '/dɔɡ/' }, { word: 'red', phonetic: '/rɛd/' }, { word: 'bird', phonetic: '/bɜrd/' }] },
  { symbol: 't', type: 'consonant', description: '清音"特"', examples: [{ word: 'tree', phonetic: '/triː/' }, { word: 'cat', phonetic: '/kæt/' }, { word: 'hat', phonetic: '/hæt/' }] },
  { symbol: 'ɡ', type: 'consonant', description: '浊音"哥"', examples: [{ word: 'go', phonetic: '/ɡoʊ/' }, { word: 'green', phonetic: '/ɡriːn/' }, { word: 'dog', phonetic: '/dɔɡ/' }] },
  { symbol: 'k', type: 'consonant', description: '清音"科"', examples: [{ word: 'cat', phonetic: '/kæt/' }, { word: 'book', phonetic: '/bʊk/' }, { word: 'kite', phonetic: '/kaɪt/' }] },
  { symbol: 'f', type: 'consonant', description: '清音"夫"', examples: [{ word: 'fish', phonetic: '/fɪʃ/' }, { word: 'food', phonetic: '/fuːd/' }, { word: 'phone', phonetic: '/foʊn/' }] },
  { symbol: 'v', type: 'consonant', description: '浊音"呜"', examples: [{ word: 'very', phonetic: '/ˈvɛri/' }, { word: 'love', phonetic: '/lʌv/' }, { word: 'violin', phonetic: '/vaɪəˈlɪn/' }] },
  { symbol: 's', type: 'consonant', description: '清音"丝"', examples: [{ word: 'sun', phonetic: '/sʌn/' }, { word: 'cat', phonetic: '/kæt/' }, { word: 'bus', phonetic: '/bʌs/' }] },
  { symbol: 'z', type: 'consonant', description: '浊音"兹"', examples: [{ word: 'zoo', phonetic: '/zuː/' }, { word: 'is', phonetic: '/ɪz/' }, { word: 'nose', phonetic: '/noʊz/' }] },
  { symbol: 'ʃ', type: 'consonant', description: '清音"嘘"', examples: [{ word: 'she', phonetic: '/ʃiː/' }, { word: 'fish', phonetic: '/fɪʃ/' }, { word: 'ship', phonetic: '/ʃɪp/' }] },
  { symbol: 'ʒ', type: 'consonant', description: '浊音"日"', examples: [{ word: 'measure', phonetic: '/ˈmɛʒər/' }, { word: 'vision', phonetic: '/ˈvɪʒən/' }, { word: 'treasure', phonetic: '/ˈtrɛʒər/' }] },
  { symbol: 'm', type: 'consonant', description: '鼻音"姆"', examples: [{ word: 'mom', phonetic: '/mɑm/' }, { word: 'milk', phonetic: '/mɪlk/' }, { word: 'name', phonetic: '/neɪm/' }] },
  { symbol: 'n', type: 'consonant', description: '鼻音"恩"', examples: [{ word: 'nose', phonetic: '/noʊz/' }, { word: 'sun', phonetic: '/sʌn/' }, { word: 'green', phonetic: '/ɡriːn/' }] },
  { symbol: 'ŋ', type: 'consonant', description: '鼻音"嗯"', examples: [{ word: 'sing', phonetic: '/sɪŋ/' }, { word: 'long', phonetic: '/lɔŋ/' }, { word: 'morning', phonetic: '/ˈmɔrnɪŋ/' }] },
  { symbol: 'l', type: 'consonant', description: '边音"勒"', examples: [{ word: 'love', phonetic: '/lʌv/' }, { word: 'ball', phonetic: '/bɔl/' }, { word: 'yellow', phonetic: '/ˈjɛloʊ/' }] },
  { symbol: 'r', type: 'consonant', description: '卷舌"儿"', examples: [{ word: 'red', phonetic: '/rɛd/' }, { word: 'tree', phonetic: '/triː/' }, { word: 'green', phonetic: '/ɡriːn/' }] },
  { symbol: 'w', type: 'consonant', description: '半元音"我"', examples: [{ word: 'water', phonetic: '/ˈwɔtər/' }, { word: 'window', phonetic: '/ˈwɪndoʊ/' }, { word: 'swing', phonetic: '/swɪŋ/' }] },
  { symbol: 'j', type: 'consonant', description: '半元音"也"', examples: [{ word: 'yes', phonetic: '/jɛs/' }, { word: 'yellow', phonetic: '/ˈjɛloʊ/' }, { word: 'you', phonetic: '/juː/' }] },
  { symbol: 'h', type: 'consonant', description: '清音"喝"', examples: [{ word: 'hat', phonetic: '/hæt/' }, { word: 'home', phonetic: '/hoʊm/' }, { word: 'hello', phonetic: '/həˈloʊ/' }] },
  { symbol: 'tʃ', type: 'consonant', description: '清音"吃"', examples: [{ word: 'chair', phonetic: '/tʃɛr/' }, { word: 'watch', phonetic: '/wɑtʃ/' }, { word: 'teacher', phonetic: '/ˈtitʃər/' }] },
  { symbol: 'dʒ', type: 'consonant', description: '浊音"知"', examples: [{ word: 'juice', phonetic: '/dʒuːs/' }, { word: 'orange', phonetic: '/ˈɔrɪndʒ/' }, { word: 'bridge', phonetic: '/brɪdʒ/' }] },
  { symbol: 'θ', type: 'consonant', description: '清音"嘶"（咬舌）', examples: [{ word: 'three', phonetic: '/θriː/' }, { word: 'thank', phonetic: '/θæŋk/' }, { word: 'bath', phonetic: '/bæθ/' }] },
  { symbol: 'ð', type: 'consonant', description: '浊音"得"（咬舌）', examples: [{ word: 'the', phonetic: '/ðə/' }, { word: 'this', phonetic: '/ðɪs/' }, { word: 'mother', phonetic: '/ˈmʌðər/' }] },
]
