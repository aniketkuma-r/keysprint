export interface SiteConfig {
  name: string;
  author: string;
  description: string;
  keywords: Array<string>;
  url: {
    base: string;
    author: string;
  };
  links: {
    github: string;
  };
}
