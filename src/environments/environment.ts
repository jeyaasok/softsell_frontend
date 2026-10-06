import type { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: true,
  app: {
    name: 'Bracezin Soft Store',
    brandIconPath: 'favicon.png',
    supportEmail: 'projects.bracezin@gmail.com',
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    }
  },
  api: {
    baseUrl: 'https://api.bracezin.com/api/v1'
  }
};