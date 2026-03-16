import { SystemMetrics, Message, Source, CommonQuestion } from '../types';

export const generateMetrics = (): SystemMetrics => {
  const baseGpu = 30 + Math.random() * 40;
  const baseCpu = 20 + Math.random() * 35;
  const baseVram = 40 + Math.random() * 30;
  
  return {
    gpu: Math.min(100, baseGpu),
    gpuTemp: 55 + Math.random() * 30,
    vram: Math.min(100, baseVram),
    cpu: Math.min(100, baseCpu),
    memory: 45 + Math.random() * 25,
    disk: 30 + Math.random() * 15,
    network: 10 + Math.random() * 20,
    ollamaActive: Math.random() > 0.6,
    vramTotal: 8,
  };
};

export const mockSources: Source[] = [
  {
    id: '1',
    title: 'Military Rehabilitation and Compensation Act 2004',
    url: 'https://www.legislation.gov.au/Details/C2021C00402',
    level: 'L1',
    sourceType: 'legislation',
    snippet: 'The MRCA provides for the rehabilitation and compensation of current and former members of the Australian Defence Force...'
  },
  {
    id: '2',
    title: 'CLIK - MRCA Policy Manual',
    url: 'https://clik.dva.gov.au/mrca-policy-manual',
    level: 'L2',
    sourceType: 'clik',
    snippet: 'This policy manual provides guidance on the interpretation and application of the MRCA provisions...'
  },
  {
    id: '3',
    title: 'DVA.gov.au - Applying for Compensation',
    url: 'https://www.dva.gov.au/financial-support/compensation',
    level: 'L3',
    sourceType: 'dva',
    snippet: 'You can apply for compensation online through MyService or by completing a paper application form...'
  }
];

export const mockResponses: Record<string, { content: string; model: string; sources: Source[] }> = {
  'mrca': {
    content: 'The **Military Rehabilitation and Compensation Act 2004 (MRCA)** is the primary legislation for compensation and rehabilitation claims. From 1 July 2026, MRCA becomes the sole Act for all new compensation claims.\n\n**Key Points:**\n• Covers current and former ADF members\n• Provides rehabilitation, compensation, and income support\n• Replaces DRCA for new claims\n• White Card (Gold Card in some cases) for treatment\n\nIf you lodged a claim before 1 July 2026, it remains under DRCA.',
    model: 'llama3.1:8b',
    sources: [mockSources[0], mockSources[1]]
  },
  'ptsd': {
    content: 'PTSD (Post-Traumatic Stress Disorder) is a recognized condition for compensation purposes under the MRCA.\n\n**To claim PTSD:**\n1. Diagnosis from a qualified psychiatrist\n2. Evidence of service-related traumatic event(s)\n3. Statement of Principles (SoP) criteria met\n\n**Standard of Proof:**\n• Reasonable hypothesis test applies\n• You must show the condition is likely related to service\n\nI recommend gathering your medical records and incident reports before lodging.',
    model: 'qwen2.5:14b',
    sources: [mockSources[1], mockSources[2]]
  },
  'default': {
    content: 'Based on your query, I\'ve searched the DVA knowledge base including legislation, CLIK policy, and official guidance.\n\nThe relevant information suggests you should review the specific Act applicable to your claim date. For claims after 1 July 2026, MRCA applies.\n\nWould you like me to elaborate on any specific aspect?',
    model: 'llama3.1:8b',
    sources: mockSources
  }
};

export const commonQuestions: CommonQuestion[] = [
  { id: '1', category: 'Claims', question: 'How do I lodge a new compensation claim?' },
  { id: '2', category: 'Claims', question: 'What is the difference between MRCA and DRCA?' },
  { id: '3', category: 'Medical', question: 'Is PTSD covered under MRCA?' },
  { id: '4', category: 'Medical', question: 'How do I get a White Card?' },
  { id: '5', category: 'Process', question: 'What is the standard of proof?' },
  { id: '6', category: 'Process', question: 'How long does a claim take to process?' },
  { id: '7', category: 'Appeals', question: 'How do I appeal a decision?' },
  { id: '8', category: 'Support', question: 'What advocacy services are available?' },
];