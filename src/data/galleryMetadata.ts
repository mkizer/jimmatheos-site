export interface CreditEntry {
  name?: string;
  url?: string;
}

export interface GalleryImageMeta {
  credit1?: CreditEntry;
  credit2?: CreditEntry;
  credit3?: CreditEntry;
  description?: string;
}

export interface ProcessedCredit {
  name: string;
  url?: string;
}

export interface ProcessedGalleryImageMeta {
  year: string;
  credits: ProcessedCredit[];
  description?: string;
}

/**
 * Gallery image metadata registry keyed by filename (e.g. '2026_03_DescText.png', '2024_01_KoMvideo.jpg').
 * Up to three optional credit entries (each containing name and url) can be specified.
 * The year is always extracted from the filename pattern (e.g. `YYYY_NN`).
 */
export const galleryMetadata: Record<string, GalleryImageMeta> = {
  '1986_01_Explorer.jpg': {
    credit1: { name: '', url: '' },
    description: '1981 Gibson Explorer (White)',
  },
  '1989_01_BC Rich Black.jpg': {
    credit1: { name: '', url: '' },
    description: '1989 custom made BC Rich Gunslinger (Black)',
  },
  '1991_01_Jackson.jpg': {
    credit1: { name: '', url: '' },
    description: 'Terry Brown with Jim, recording Parallels.',
  },
  '1994_01_Black PRS.jpg': {
    credit1: { name: '', url: '' },
    description: '',
  },
  '2008_01_Sam Scorps.jpg': {
    credit1: { name: '', url: '' },
    description: '',
  },
  '2010_01_LA1.jpg': {
    credit1: { name: 'Julie A. Ferguson', url: '' },
    description: 'Fates Warning in Hollywood, CA - 03/19/2010',
  },
  '2010_01_LA2.jpg': {
    credit1: { name: 'Alex Solca', url: 'https://alexsolca.zenfolio.com/' },
    description: 'Fates Warning in Hollywood, CA - 03/19/2010',
  },
  '2010_01_Thessaloniki_20100327.jpg': {
    credit1: { name: '', url: '' },
    description: 'Fates Warning in Thessaloniki, Greece - 02/26/2010',
  },
  '2011_01_Essen Germany 2011.jpg': {
    credit1: { name: 'H. Ransch', url: '' },
    description: 'Fates Warning in Essen, Germany - 02/10/2011',
  },
  '2011_02_Fates_Warning_Essen_20110210_HR-63.jpg': {
    credit1: { name: 'H. Ransch', url: '' },
    description: 'Fates Warning in Essen, Germany - 02/10/2011',
  },
  '2011_03_Kerkrade Netherlands.jpg': {
    credit1: { name: 'Jorg de Groot', url: '' },
    description: 'Fates Warning in Kerkrade, Netherlands - 07/30/2011',
  },
  '2011_04_Studio - credit Lindsay Matheos.jpg': {
    credit1: { name: 'Laurie Matheos', url: '' },
    description: 'Studio 2011',
  },
  '2017_01_Hug - credit Jeremy Saffer.jpg': {
    credit1: { name: 'Jeremy Saffer', url: 'https://jeremysaffer.com/' },
    description: '',
  },
  '2017_02_Point - credit Jeremey Saffer.jpg': {
    credit1: { name: 'Jeremy Saffer', url: 'https://jeremysaffer.com/' },
    description: '',
  },
  '2017_03_jim.jpg': {
    credit1: { name: 'PAG', url: 'https://www.facebook.com/pag.noble/' },
    description: '',
  },
  '2017_04_Jim_Matheos_of_Fates_Warning_in_Bratislava_PAG.jpg': {
    credit1: { name: 'PAG', url: 'https://www.facebook.com/pag.noble/' },
    description: 'Fates Warning in Bratislava, Slovakia - 02/03/2017',
  },
  '2017_05_JM_ItComesInWaves.jpg': {
    credit1: { name: 'Laurie Matheos', url: '' },
    description: 'Tuesday The Sky "Drift" promo photo',
  },
  '2018_01_Matheos-2_Credit_Chris-Kissadjekian-20180126.jpg': {
    credit1: { name: 'Chris Kissadjekian', url: '' },
    description: 'Fates Warning in Thessaloniki, Greece - 01/26/2018',
  },
  '2019_01_jimmatheos.jpg': {
    credit1: { name: 'Mark A. Cubbedge', url: 'https://www.markacubbedge.com/' },
    description: '',
  },
  '2019_02_jimmatheos.jpg': {
    credit1: { name: 'Mark A. Cubbedge', url: 'https://www.markacubbedge.com/' },
    description: '',
  },
  '2022_01_JM_Jeremy Saffer.jpg': {
    credit1: { name: 'Jeremy Saffer', url: 'https://jeremysaffer.com/' },
    description: '',
  },
};

export function getGalleryImageMeta(filename: string): ProcessedGalleryImageMeta {
  const custom = galleryMetadata[filename] || {};

  // Parse YYYY from filename pattern like 2024_01_KoM.jpg
  const match = filename.match(/^(\d{4})/i) || filename.match(/(\d{4})_\d+/i);
  const year = match ? match[1] : '';

  // Process up to three optional credit entries
  const rawCredits = [custom.credit1, custom.credit2, custom.credit3];
  const credits: ProcessedCredit[] = [];

  for (const entry of rawCredits) {
    if (entry && entry.name && entry.name.trim().length > 0) {
      credits.push({
        name: entry.name.trim(),
        url: entry.url && entry.url.trim().length > 0 ? entry.url.trim() : undefined,
      });
    }
  }

  const description =
    custom.description && custom.description.trim().length > 0 ? custom.description.trim() : undefined;

  return {
    year,
    credits,
    description,
  };
}
