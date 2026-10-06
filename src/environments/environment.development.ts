import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: false,
  app: {
    name: 'Bracezin Soft Store (Dev)',
    brandIconPath: 'favicon.png',
    supportEmail: 'projects.bracezin@gmail.com',
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    }
  },
  api: {
    // baseUrl: 'https://included-maggot-classic.ngrok-free.app/api/v1'
    baseUrl: 'http://localhost:8000/api/v1'
  }
};