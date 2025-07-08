

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Issue, Source, SourceType, GeminiIssueResponse, GeminiSourceResponse, OccurrenceDetails } from '../types';
import { GEMINI_MODEL_NAME, OCCURRENCE_CONTRIBUTION_RANGES } from '../constants';

const API_KEY = process.env.API_KEY;

const generateRandomAlphanumeric = (length: number = 7) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomDate = (): string => {
  const year = 2020 + Math.floor(Math.random() * 6); // 2020-2025
  const month = Math.floor(Math.random() * 12); 
  const day = Math.floor(Math.random() * 28) + 1; 
  return new Date(year, month, day).toISOString();
};

const mapGeminiSourceTypeToEnum = (geminiType: string): SourceType => {
    const sTypeLower = geminiType.toLowerCase().trim();
    if (sTypeLower.includes('youtube transcript')) return SourceType.YouTube; 
    if (sTypeLower.includes('youtube comment')) return SourceType.YouTube;
    if (sTypeLower.includes('youtube')) return SourceType.YouTube;
    if (sTypeLower.includes('google article') || sTypeLower.includes('article')) return SourceType.GoogleArticles;
    if (sTypeLower.includes('reddit post') || sTypeLower.includes('reddit')) return SourceType.RedditPosts;
    if (sTypeLower.includes('twitter post') || sTypeLower.includes('tweet') || sTypeLower.includes('twitter')) return SourceType.Tweets;
    if (sTypeLower.includes('trustpilot review') || sTypeLower.includes('trustpilot')) return SourceType.TrustpilotPosts;
    
    // Fallback if a more generic term is used by Gemini, attempt mapping
    const matchedSourceType = Object.values(SourceType).find(st => st.toLowerCase() === sTypeLower);
    if (matchedSourceType) {
      return matchedSourceType;
    }
    
    console.warn(`Unexpected source type from Gemini: '${geminiType}', defaulting to GoogleArticles.`);
    return SourceType.GoogleArticles; 
};
import { Issue, SourceType } from '../types';

export const analyzeProductFeedback = async (productName: string, plan: string = 'free') => {
  const response = await fetch('/.netlify/functions/askGemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: productName }),
  });

  const data = await response.json();

  if (!data.issues) {
    throw new Error(data.error || 'No issues returned from Gemini.');
  }

  const parsedIssues = data.issues
    .split(/\n+/)
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);

  return parsedIssues.map((text, index) => ({
    id: `ai_${Date.now()}_${index}`,
    title: text,
    description: text,
    source: 'AI',
    sourceType: SourceType.GoogleArticles,
    timestamp: Date.now(),
    occurrences: 1,
    totalOccurrences: 1,
    sentiment: null,
    severity: 'medium',
    tags: [],
  })) as Issue[];
};
