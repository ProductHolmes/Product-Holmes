import { Issue, Source, SourceType, GeminiIssueResponse } from '../types';
import { OCCURRENCE_CONTRIBUTION_RANGES } from '../constants';

// --- Helper functions from your original file ---
const generateRandomAlphanumeric = (length: number = 7) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const generateRandomDate = (): string => {
  const year = 2023 + Math.floor(Math.random() * 2); // Last 2 years
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day).toISOString();
};

const mapGeminiSourceTypeToEnum = (geminiType: string): SourceType => {
    const sTypeLower = geminiType.toLowerCase().trim();
    if (sTypeLower.includes('youtube')) return SourceType.YouTube;
    if (sTypeLower.includes('google article')) return SourceType.GoogleArticles;
    if (sTypeLower.includes('reddit')) return SourceType.RedditPosts;
    if (sTypeLower.includes('twitter')) return SourceType.Tweets;
    if (sTypeLower.includes('trustpilot')) return SourceType.TrustpilotPosts;
    return SourceType.GoogleArticles; // Fallback
};

// --- The Main Function ---
export const analyzeProductFeedback = async (productName: string, plan: string | null = 'free'): Promise<Issue[]> => {
  const response = await fetch('/.netlify/functions/askGemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: productName, plan: plan }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Failed to parse error from server.' }));
    throw new Error(errorData.error || `Analysis request failed with status ${response.status}`);
  }

  const geminiIssues: GeminiIssueResponse[] = await response.json();

  if (!Array.isArray(geminiIssues)) {
    throw new Error('AI response was not in the expected format.');
  }

  // Hydrate the clean AI data with additional details for the UI
  return geminiIssues.map((geminiIssue, index): Issue => {
    const issueId = `issue_${Date.now()}_${index}`;
    
    const mappedSources: Source[] = geminiIssue.sources.map((src, srcIndex) => ({
      id: `${issueId}_source_${srcIndex}`,
      type: mapGeminiSourceTypeToEnum(src.type),
      url: src.url,
      title: src.title,
    }));

    const occurrenceDetails: { [key in SourceType]?: number } = {};
    let totalOccurrences = 0;
    
    const uniqueSourceTypes = new Set(mappedSources.map(s => s.type));
    uniqueSourceTypes.forEach(sourceType => {
        const range = OCCURRENCE_CONTRIBUTION_RANGES[sourceType];
        if (range) {
            const count = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            occurrenceDetails[sourceType] = count;
            totalOccurrences += count;
        }
    });

    // Ensure at least a small number of occurrences if none were generated
    if (totalOccurrences === 0) {
        totalOccurrences = Math.floor(Math.random() * 20) + 1;
    }

    return {
      id: issueId,
      description: geminiIssue.description,
      category: geminiIssue.category,
      sources: mappedSources,
      occurrenceDetails,
      totalOccurrences,
      lastDetected: generateRandomDate(),
    };
  });
};
