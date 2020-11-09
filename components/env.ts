import { AuthTokens } from '../auth';

export interface Env {
  initialAuth?: AuthTokens;
  isProd: boolean;
  openaiKey: string;
  openaiSecretKey: string;
}

export interface EnvProps {
  props: Env;
}
