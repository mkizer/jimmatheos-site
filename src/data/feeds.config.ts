export interface ProjectFeed {
  id: string;
  name: string;
  url: string;
  siteUrl: string;
  badgeLabel: string;
}

export const PROJECT_FEEDS: ProjectFeed[] = [
  {
    id: 'north-sea-echoes',
    name: 'North Sea Echoes',
    url: 'https://northseaechoes.com/rss.xml',
    siteUrl: 'https://northseaechoes.com',
    badgeLabel: 'North Sea Echoes',
  },
  {
    id: 'kings-of-mercia',
    name: 'Kings of Mercia',
    url: 'https://kingsofmercia.com/rss.xml',
    siteUrl: 'https://kingsofmercia.com',
    badgeLabel: 'Kings of Mercia',
  },
  {
    id: 'tuesday-the-sky',
    name: 'Tuesday The Sky',
    url: 'https://tuesdaythesky.com/rss.xml',
    siteUrl: 'https://tuesdaythesky.com',
    badgeLabel: 'Tuesday The Sky',
  },
];
