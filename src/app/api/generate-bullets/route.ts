import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
    try {
        // Get user input
        const body = await request.json()
        const userDescription = body.description

        if (!userDescription) {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            )
        }

        // Check API key
        if (!process.env.GEMINI_API_KEY) {
            console.error('❌ GEMINI_API_KEY not found')
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            )
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Create prompt
        const prompt = `You are a professional resume writer. Generate 3-5 achievement-focused resume bullet points based on this experience:

"${userDescription}"

Requirements:
- Start each bullet with a strong action verb (Developed, Implemented, Built, etc.)
- Include specific metrics or quantifiable results when possible
- Keep each bullet to 1-2 lines
- Focus on impact and achievements, not just responsibilities
- Use professional language

Return ONLY the bullet points in this exact format:
- First bullet here
- Second bullet here
- Third bullet here

Use a newline character between each bullet point.`;

        // Generate content
        console.log('🚀 Calling Gemini API...')
        const result = await model.generateContent(prompt);
        const response = result.response;
        const bullets = response.text();

        console.log('✅ Successfully generated bullets')
        return NextResponse.json({ bullets })

    } catch (error: any) {
        console.error('❌ AI API ERROR:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to generate bullets' },
            { status: 500 }
        )
    }
}