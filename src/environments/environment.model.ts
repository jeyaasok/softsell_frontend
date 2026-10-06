export interface AppEnvironment {
  production: boolean;
  app: {
    name: string;
    brandIconPath: string;
    supportEmail: string;
    socialLinks: {
      github: string;
      twitter: string;
      linkedin: string;
    };
  };
  api: {
    baseUrl: string;
  };
}