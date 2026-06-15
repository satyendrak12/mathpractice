import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const chapterName = formData.get('chapterName') as string
    const pdf = formData.get('pdf') as File | null

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a Class 11 and 12 Maths teacher. Generate exactly 15 flashcards for the topic: "${chapterName}".

Each flashcard should have:
- A clear question on the front
- A concise answer on the back

IMPORTANT RULES:
- Do NOT use LaTeX or dollar signs ($) for math
- Write math in plain text only
- Keep answers short and clear (1-3 lines max)
- Focus on important concepts, formulas, and theorems
- Return ONLY a valid JSON array, no other text, no markdown, no backticks

Return in this exact format:
[
  {"question": "What is the question?", "answer": "This is the answer"},
  {"question": "What is the question?", "answer": "This is the answer"}
]`

    let result

    if (pdf) {
      const pdfBytes = await pdf.arrayBuffer()
      const pdfData = {
        inlineData: {
          data: Buffer.from(pdfBytes).toString('base64'),
          mimeType: 'application/pdf'
        }
      }
      result = await model.generateContent([prompt, pdfData])
    } else {
      result = await model.generateContent(prompt)
    }

    const text = result.response.text()
    const clean = text.replace(/```json|```/g, '').trim()
    const flashcards = JSON.parse(clean)

    return NextResponse.json({ flashcards })

  } catch (error) {
    console.error('Flashcard generation error:', error)
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 })
  }
}