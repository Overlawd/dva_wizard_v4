import { User, Message, Source, QueryLog, QuestionnaireData } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const MOCK_SOURCES: Source[] = [
  {
    id: 'src-1',
    title: 'DVA Hearing Loss Guide 2024',
    url: 'dva.gov.au/hearing-loss',
    snippet: 'Hearing loss is a common condition for veterans. Claims must be supported by audiometric testing...',
  },
  {
    id: 'src-2',
    title: 'MRC 2024-25 Payment Rates',
    url: 'dva.gov.au/payment-rates',
    snippet: 'The Maximum Basic Rate (MBR) for a single veteran with 100% disability is $1,240.50 per fortnight...',
  },
];

const MOCK_QUERIES: QueryLog[] = [
  {
    id: 'q-1',
    user: 'John Doe',
    query: 'How do I apply for TPI?',
    response: 'To apply for Totally and Permanently Incapacitated (TPI) status...',
    timestamp: new Date(Date.now() - 86400000),
    status: 'active',
  },
  {
    id: 'q-2',
    user: 'Jane Smith',
    query: 'Is dental covered?',
    response: 'Dental care is covered under DVA Health Cards...',
    timestamp: new Date(Date.now() - 172800000),
    status: 'flagged',
  },
];

// Auth Service
export const login = async (username: string, password: string): Promise<{ user: User; token: string }> => {
  await delay(800);
  
  // Simple validation simulation
  if (!username || !password) {
    throw new Error('Please enter username and password');
  }

  const user: User = {
    id: 'user-123',
    name: 'Demo Veteran',
    role: username.includes('admin') ? 'admin' : 'veteran',
    serviceNumber: 'VA-987654',
  };

  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const logout = async (): Promise<void> => {
  await delay(300);
};

// Chat Service
export const sendMessage = async (content: string): Promise<Message> => {
  await delay(1500); // Simulate AI thinking time

  return {
    id: 'msg-' + Date.now(),
    role: 'assistant',
    content: `Based on your query regarding "${content}", I have found relevant information in the DVA policy database. You may be eligible for additional benefits under the Safety, Rehabilitation and Compensation Act. Please ensure your medical records are up to date.`,
    timestamp: new Date(),
    sources: MOCK_SOURCES,
    trustLevel: 94,
    curated: null,
  };
};

// Admin Service
export const getQueries = async (): Promise<QueryLog[]> => {
  await delay(500);
  return MOCK_QUERIES;
};

export const deleteQuery = async (id: string): Promise<void> => {
  await delay(400);
  const index = MOCK_QUERIES.findIndex(q => q.id === id);
  if (index > -1) {
    MOCK_QUERIES.splice(index, 1);
  }
};

export const scrapeUrl = async (url: string): Promise<{ success: boolean; message: string }> => {
  await delay(2000); // Simulate scraping process
  return {
    success: true,
    message: `Successfully scraped and indexed ${url}. 14 new documents added to knowledge base.`,
  };
};

// Veteran Service
export const submitQuestionnaire = async (data: QuestionnaireData): Promise<{ result: string }> => {
  await delay(1000);
  let rating = '0%';
  
  if (data.serviceConnected && data.disabilityPercentage > 0) {
    rating = `${data.disabilityPercentage}%`;
  } else if (data.serviceConnected) {
    rating = 'Pending Assessment';
  }

  return {
    result: `Estimated Entitlement: ${rating} Disability Pension. Review complete.`,
  };
};