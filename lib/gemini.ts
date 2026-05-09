import { GoogleGenerativeAI } from '@google/generative-ai'

import type { ChatMessage, FeedItem } from '@/types'

export const RDEC_CONTEXT = `
You are the AI assistant for RDEC Campus - R.D. Engineering College, Ghaziabad, UP.
AKTU affiliated. NAAC accredited. Approx 2,400 students.
Active clubs: GfG Student Community, Nexora, Mehfil, Spotlight, Velocity, Sukham, HotTake.
Annual tech fest: Syntaxis (September). Placement rate: 94% (Class of 2024).
Answer queries about campus life, events, clubs, placements, and academics.
Be concise, friendly, and accurate. If you are not sure, say so.
`

const MODEL_NAME = 'gemini-2.0-flash-exp'

export const hasGeminiConfig = Boolean(process.env.GEMINI_API_KEY)

function getGeminiModel() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in .env.local')
  }

  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY).getGenerativeModel({
    model: MODEL_NAME,
  })
}

function formatHistory(history: ChatMessage[] = []) {
  return history
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join('\n')
}

export function buildChatPrompt(message: string, history: ChatMessage[] = [], context = ''): string {
  return `${RDEC_CONTEXT}

Relevant campus context:
${context || 'No live event/news context was provided.'}

Conversation so far:
${formatHistory(history) || 'No previous messages.'}

Student question:
${message}

Reply in 2-5 concise sentences.`
}

export function buildFeedPrompt(user: { id: string; interests?: string[] }, items: FeedItem[]): string {
  return `${RDEC_CONTEXT}

User interests: ${user.interests?.length ? user.interests.join(', ') : 'not provided'}

Candidate feed items as JSON:
${JSON.stringify(items)}

Rank these items for relevance to the user. Return only a JSON array of item IDs ordered from most relevant to least relevant.`
}

export function buildReportPrompt(input: {
  eventTitle: string
  rsvpCount: number
  presentCount: number
  absentCount: number
  taskCount: number
  completedTaskCount: number
}): string {
  return `${RDEC_CONTEXT}

Create a concise markdown post-event report for:
- Event: ${input.eventTitle}
- RSVPs: ${input.rsvpCount}
- Present: ${input.presentCount}
- Absent: ${input.absentCount}
- Tasks completed: ${input.completedTaskCount}/${input.taskCount}

Include sections for Summary, Attendance, Operations, Highlights, and Follow-ups.`
}

export async function generateChatReply(
  message: string,
  history: ChatMessage[] = [],
  context = ''
): Promise<string> {
  const result = await getGeminiModel().generateContent(buildChatPrompt(message, history, context))
  return result.response.text()
}

export async function rankFeedItems(
  user: { id: string; interests?: string[] },
  items: FeedItem[]
): Promise<FeedItem[]> {
  if (!items.length) {
    return []
  }

  const result = await getGeminiModel().generateContent(buildFeedPrompt(user, items))
  const orderedIds = parseJsonArray(result.response.text())

  if (!orderedIds.length) {
    return items
  }

  const byId = new Map(items.map((item) => [item.id, item]))
  const ranked = orderedIds.flatMap((id) => {
    const item = byId.get(String(id))
    return item ? [item] : []
  })
  const remaining = items.filter((item) => !orderedIds.includes(item.id))

  return [...ranked, ...remaining]
}

export async function generateEventReport(input: Parameters<typeof buildReportPrompt>[0]) {
  const result = await getGeminiModel().generateContent(buildReportPrompt(input))
  return result.response.text()
}

function parseJsonArray(value: string): unknown[] {
  const json = value.match(/\[[\s\S]*\]/)?.[0]

  if (!json) {
    return []
  }

  try {
    const parsed = JSON.parse(json)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
