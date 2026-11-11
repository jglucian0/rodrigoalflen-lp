export interface Credentials {
  name: string;
  email: string;
  login: string;
  password: string;
}

export type ActionState = {
  error?: string;
  message?: string;
  clientId?: string;
  credentials?: Credentials;
} | null;