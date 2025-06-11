import { JwtPayload } from 'jwt-decode';

interface MedicoPayload {
  id: number; // Ou string
  name: string;
  email: string;
  phone: string;
  crm: string;
}

declare module 'jwt-decode' {
  interface JwtPayload {
    // Agora o payload tem uma propriedade 'medico' que é do tipo MedicoPayload
    medico: MedicoPayload;
    // As propriedades 'iat' e 'exp' são padrão e já podem estar na JwtPayload base
    // mas você pode adicioná-las aqui se quiser ter certeza.
    // iat?: number;
    // exp?: number;
  }
}