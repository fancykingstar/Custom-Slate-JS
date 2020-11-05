import { AuthTokens } from '../auth';

export interface Env {
  initialAuth?: AuthTokens;
  isDevelopment: boolean;
  openaiKey: string;
  openaiSecretKey: string;
}

export interface EnvProps {
  props: Env;
}
