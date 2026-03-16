import { SystemStatus, ChatMessage, Source } from '../types';

export const mockSystemStatus: SystemStatus = {
  gpuLoad: 45,
  vramUsed: 3.2,
  vramTotal: 6.0,
  dbStatus: 'connected',
  lastScrape: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  totalIndexed: 5420,
  activeModel: 'llama3:8b'
};

export const mockSources: Source[] = [
  {
    id: '1',
    title: 'Military Rehabilitation and Compensation Act 2004',
    url: 'https://www.legislation.gov.au/Details/C2022C00169',
    level: 'L1',
    type: 'legislation',
    trustScore: 1.0,
    snippet: 'Section 4: The purpose of this Act is to provide for the rehabilitation and compensation of members of the Defence Force...'
  },
  {
    id: '2',
    title: 'MRCA Policy Manual - Chapter 36',
    url: 'https://clik.dva.gov.au/mrca-policy-manual/part-1',
    level: 'L2',
    type: 'clik',
    trustScore: 0.95,
    snippet: 'A disease is a serious injury if the disease is specified in the Statement of Principles...'
  },
  {
    id: '3',
    title: 'Mental Health Support Services',
    url: 'https://www.dva.gov.au/health-and-wellbeing/mental-health',
    level: 'L3',
    type: 'dva',
    trustScore: 0.85,
    snippet: 'Open Arms provides free and confidential counselling services to current and former ADF members...'
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Welcome to DVA Wizard. I can help you navigate compensation claims, legislation, and support services. How can I assist you today?',
    timestamp: new Date(),
    sources: []
  }
];