import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'News',
      href: getBlogPermalink(),
    },
    {
      text: 'Bio',
      href: getPermalink('/bio'),
    },
    {
      text: 'Discography',
      href: getPermalink('/discography'),
    },
    {
      text: 'Gear',
      href: getPermalink('/gear'),
    },
    {
      text: 'Videos',
      href: getPermalink('/videos'),
    },
    {
      text: 'Images',
      href: getPermalink('/images'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Navigation',
      links: [
        { text: 'News', href: getBlogPermalink() },
        { text: 'Bio', href: getPermalink('/bio') },
        { text: 'Discography', href: getPermalink('/discography') },
        { text: 'Gear', href: getPermalink('/gear') },
      ],
    },
    {
      title: 'Media',
      links: [
        { text: 'Videos', href: getPermalink('/videos') },
        { text: 'Images', href: getPermalink('/images') },
        { text: 'Contact', href: getPermalink('/contact') },
      ],
    },
    {
      title: 'Projects',
      links: [
        { text: 'North Sea Echoes', href: 'https://northseaechoes.com', target: '_blank' },
        { text: 'Kings of Mercia', href: 'https://kingsofmercia.com', target: '_blank' },
        { text: 'Tuesday The Sky', href: 'https://tuesdaythesky.com', target: '_blank' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/JimMatheosOfficial' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
  © 2026 Jim Matheos. All rights reserved.<br />
  Site by <a class="text-muted hover:text-gray-700 hover:underline dark:text-gray-400 transition duration-150 ease-in-out" href="https://michaelkizer.com/" target="_blank">Michael Kizer</a>
  `,
};
