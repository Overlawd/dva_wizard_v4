import { Message, SystemMetrics } from '../types';

export const mockMetrics: SystemMetrics = {
  cpu: 24,
  memory: 45,
  gpu: 62,
  vram: 78,
};

export const generateMockResponse = async (query: string): Promise<Message> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: `Based on the **Military Rehabilitation and Compensation Act 2004 (MRCA)**, regarding your query about "${query}":\n\nUnder Section 24, liability for treatment is accepted if the condition is reasonably attributable to service. The Safety, Rehabilitation and Compensation Act 1988 (SRCA) may also apply depending on the date of injury.\n\nI recommend lodging a claim using the D904 form if this injury occurred after July 2004.`,
    timestamp: new Date(),
    citations: [
      {
        id: '1',
        title: 'Military Rehabilitation and Compensation Act 2004',
        source: 'legislation.gov.au',
        relevance: 0.95,
      },
      {
        id: '2',
        title: 'Section 24 - Liability for Treatment',
        source: 'comlaw.gov.au',
        relevance: 0.88,
      },
    ],
  };
};