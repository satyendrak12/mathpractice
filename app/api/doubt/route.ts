import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const question = formData.get('question') as string
    const image = formData.get('image') as File | null

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a concise Class 11 and 12 Maths teacher. A student has this doubt:

"${question || 'Solve the maths problem in the image'}"

Give a SHORT and CLEAR response with:
1. Solution - Step by step but brief (max 5 steps)
2. Key Formula - One line
3. Exam Tip - One line

IMPORTANT RULES:
- Do NOT use LaTeX or dollar signs ($) for math
- Write math in plain text only
- Keep total response under 200 words
- Be direct and simple
- At the end always write the final answer on its own line starting with "FINAL ANSWER: " in capital letters`

    let result

    if (image) {
      const imageBytes = await image.arrayBuffer()
      const imageData = {
        inlineData: {
          data: Buffer.from(imageBytes).toString('base64'),
          mimeType: image.type
        }
      }
      result = await model.generateContent([prompt, imageData])
    } else {
      result = await model.generateContent(prompt)
    }

    const solution = result.response.text()
    return NextResponse.json({ solution })

  } catch (error) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: 'Failed to get solution' }, { status: 500 })
  }
}