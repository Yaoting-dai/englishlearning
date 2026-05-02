const API_ENDPOINT = process.env.NEXT_PUBLIC_DOUBAO_ENDPOINT || ''
const API_KEY = process.env.NEXT_PUBLIC_DOUBAO_API_KEY || ''
const API_MODEL = process.env.NEXT_PUBLIC_DOUBAO_MODEL || ''

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const systemPrompts: Record<string, string> = {
  kindergarten: `You are Elizabeth, a friendly English teacher for young children (age 3-6).
Rules:
- Use VERY simple words and short sentences (3-6 words)
- Always include emojis
- Speak slowly and clearly
- Be warm, encouraging, and patient
- Only introduce one new concept at a time
- Use lots of praise like "Great job!" "Wonderful!" 🌟`,

  elementary: `You are Elizabeth, an encouraging English teacher for elementary students (age 6-12).
Rules:
- Use simple but complete sentences
- Include emojis occasionally
- Introduce new vocabulary naturally
- Correct mistakes gently
- Ask simple questions to keep conversation going
- Praise effort and progress`,

  middle: `You are Elizabeth, an engaging English teacher for middle school students (age 12-15).
Rules:
- Use natural conversational English
- Introduce more complex vocabulary and expressions
- Discuss interesting topics (culture, science, daily life)
- Ask open-ended questions
- Provide thoughtful feedback
- Encourage critical thinking in English`,
}

export async function sendMessage(messages: ChatMessage[], ageLevel: string): Promise<string> {
  // Check if API is configured
  if (!API_ENDPOINT || !API_KEY || !API_MODEL) {
    // Demo mode: return contextual mock response
    await new Promise(resolve => setTimeout(resolve, 1000))
    const userMsg = messages[messages.length - 1]?.content || ''
    const greetings = ['hello', 'hi', 'hey', 'start']
    const isGreeting = greetings.some(g => userMsg.toLowerCase().includes(g))

    if (isGreeting) {
      const replies: Record<string, string> = {
        kindergarten: "Hello there! 🌟 I'm Elizabeth! Let's learn English together! 🎉",
        elementary: "Hi! I'm Elizabeth. It's great to meet you! How are you today? 😊",
        middle: "Hello! I'm Elizabeth, your English teacher. Ready for an interesting conversation?",
      }
      return replies[ageLevel] || "Hello! Tell me about your day!"
    }

    // Varied demo responses to avoid repetition
    const demos: Record<string, string[]> = {
      kindergarten: [
        "That's great! 🌟 Can you tell me more? What color do you like?",
        "Wonderful! 🎉 Do you like animals? I love cats and dogs! 🐱🐶",
        "Good job! 👏 Let's practice some words! Can you say 'apple'? 🍎",
        "Amazing! 🌟 What's your favorite toy? I like balls and dolls! 🎈",
        "Super! ⭐ Let's count together! One, two, three! Can you try? 🔢",
      ],
      elementary: [
        "That's interesting! 😊 Can you tell me more about that?",
        "Great answer! 👏 How was your day today? Did you do anything fun?",
        "Excellent! 🌟 What's your favorite subject in school?",
        "I like that! 🎉 Do you have any hobbies? I love reading and drawing!",
        "Wonderful! ⭐ Let's learn a new word. What do you call this? 🤔",
      ],
      middle: [
        "That's a great point! 😊 Tell me more about your thoughts.",
        "Interesting! 👏 How do you feel about that?",
        "Excellent perspective! 🌟 What else have you been learning lately?",
        "Good thinking! 🎉 Do you have any questions for me?",
        "I appreciate that! ⭐ Let's explore this topic further!",
      ],
    }

    const list = demos[ageLevel] || demos.elementary
    const idx = Math.floor(Math.random() * list.length)
    return list[idx]
  }

  // Add system prompt based on age level
  const systemPrompt = systemPrompts[ageLevel] || systemPrompts.elementary
  const fullMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ]

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: API_MODEL,
        messages: fullMessages,
        temperature: 0.8,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Doubao API error:', response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || '...'
  } catch (err) {
    console.error('Failed to call Doubao API:', err)
    throw err
  }
}
