import { PROJECT_FEEDS, type ProjectFeed } from '~/data/feeds.config';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';
import type { AggregatedPost } from '~/types';

/**
 * Strips HTML tags and decodes common HTML entities.
 */
function cleanText(text: string): string {
  return text
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts the inner text of an XML tag, handling CDATA blocks.
 */
function extractTagContent(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';
  return cleanText(match[1]);
}

/**
 * Parses RSS 2.0 or Atom XML content into AggregatedPost items.
 */
export function parseRssXml(xml: string, feed: ProjectFeed): AggregatedPost[] {
  const posts: AggregatedPost[] = [];

  // Match RSS 2.0 <item> or Atom <entry>
  const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  for (const itemXml of itemMatches) {
    const title = extractTagContent(itemXml, 'title');
    if (!title) continue;

    // Link: either <link>...</link> or Atom <link href="..." />
    let link = extractTagContent(itemXml, 'link');
    if (!link) {
      const atomLinkMatch = itemXml.match(/<link[^>]*href=["']([^"']+)["']/i);
      if (atomLinkMatch) link = atomLinkMatch[1];
    }
    if (!link) link = feed.siteUrl;

    // Date: pubDate or updated / published
    const dateStr =
      extractTagContent(itemXml, 'pubDate') ||
      extractTagContent(itemXml, 'dc:date') ||
      extractTagContent(itemXml, 'published') ||
      extractTagContent(itemXml, 'updated');

    const parsedDate = dateStr ? new Date(dateStr) : new Date();
    const validDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

    // Excerpt: description or summary
    const excerpt =
      extractTagContent(itemXml, 'description') ||
      extractTagContent(itemXml, 'summary') ||
      extractTagContent(itemXml, 'content:encoded');

    // Create unique ID
    const guid = extractTagContent(itemXml, 'guid') || extractTagContent(itemXml, 'id') || link;
    const cleanId = `${feed.id}-${guid.replace(/[^a-zA-Z0-9_-]/g, '').slice(-20)}`;

    posts.push({
      id: cleanId,
      title,
      publishDate: validDate,
      excerpt: excerpt ? excerpt.slice(0, 220) + (excerpt.length > 220 ? '...' : '') : undefined,
      link,
      source: feed.name,
      sourceId: feed.id,
      isExternal: true,
    });
  }

  return posts;
}

/**
 * Fetches an external RSS feed with an explicit 5-second timeout and resilient fallback.
 */
export async function fetchRemoteFeed(feed: ProjectFeed): Promise<AggregatedPost[]> {
  try {
    // Explicit 5-second timeout via standard AbortSignal.timeout
    const response = await fetch(feed.url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'User-Agent': 'JimMatheosSite/1.0 (+https://jimmatheos.com)',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      console.warn(`[RSS Sync] Warning: "${feed.name}" returned HTTP ${response.status}. Skipping feed.`);
      return [];
    }

    const xmlText = await response.text();
    return parseRssXml(xmlText, feed);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[RSS Sync] Resilient fallback: Failed to fetch "${feed.name}" (${feed.url}): ${errorMsg}`);
    return [];
  }
}

let _aggregatedNewsCache: AggregatedPost[] | null = null;

/**
 * Retrieves all aggregated news: combines local posts with external project RSS feeds.
 */
export async function getAggregatedNews(): Promise<AggregatedPost[]> {
  if (_aggregatedNewsCache) {
    return _aggregatedNewsCache;
  }

  // 1. Fetch local posts
  const localPosts = await fetchPosts();
  const normalizedLocal: AggregatedPost[] = localPosts.map((post) => ({
    id: post.id,
    title: post.title,
    publishDate: post.publishDate,
    excerpt: post.excerpt,
    link: getPermalink(post.permalink, 'post'),
    source: 'Jim Matheos',
    sourceId: 'jim-matheos',
    isExternal: false,
    image: post.image,
  }));

  // 2. Fetch remote feeds concurrently with Promise.allSettled
  const feedResults = await Promise.allSettled(PROJECT_FEEDS.map((feed) => fetchRemoteFeed(feed)));

  const remotePosts = feedResults
    .filter((res): res is PromiseFulfilledResult<AggregatedPost[]> => res.status === 'fulfilled')
    .flatMap((res) => res.value);

  // 3. Combine and sort descending by publishDate
  const allPosts = [...normalizedLocal, ...remotePosts].sort(
    (a, b) => b.publishDate.getTime() - a.publishDate.getTime()
  );

  _aggregatedNewsCache = allPosts;
  return allPosts;
}
