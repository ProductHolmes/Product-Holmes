import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const handler = async (event: any) => {
  const { product } = JSON.parse(event.body || '{}');

  const prompt = `Act as a product feedback investigator. Generate 5 realistic complaints for the product: "${product}". Only show problems, not praise.`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // ✅ v1-compatible model

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ issues: text }),
    };
  } catch (error: any) {
    console.error('Gemini API failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Gemini API failed.' }),
    };
  }
};

export { handler };
