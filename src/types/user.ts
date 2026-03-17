export type UserRole = 'admin' | 'veteran' | 'advocate';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  serviceNumber?: string;
}