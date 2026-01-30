import { supabase } from '@/integrations/supabase/client';

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
};

type ScrapeOptions = {
  formats?: ('markdown' | 'html' | 'rawHtml' | 'links' | 'screenshot' | 'branding' | 'summary')[];
  onlyMainContent?: boolean;
  waitFor?: number;
};

type SearchOptions = {
  limit?: number;
  lang?: string;
  country?: string;
};

export const firecrawlApi = {
  // Scrape a single URL for knowledge enhancement
  async scrape(url: string, options?: ScrapeOptions): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-scrape', {
      body: { url, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  // Search the web for component knowledge
  async search(query: string, options?: SearchOptions): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke('firecrawl-search', {
      body: { query, options },
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return data;
  },

  // Crawl Kenya-related data sources
  async crawlKenyaData(topic: string): Promise<FirecrawlResponse> {
    const queries = [
      `Kenya ${topic} statistics data`,
      `Kenya ${topic} open data portal`,
      `KNBS Kenya ${topic}`,
    ];
    
    const results = await Promise.all(
      queries.map(q => firecrawlApi.search(q, { limit: 5, country: 'ke' }))
    );
    
    return {
      success: true,
      data: results.flatMap(r => r.data || [])
    };
  }
};
