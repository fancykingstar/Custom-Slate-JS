import { AuthTokens } from '../auth';

export interface Env {
  openaiKey: string;
  openaiSecretKey: string;
  initialAuth?: AuthTokens;
}

export interface EnvProps {
  props: Env;
}
