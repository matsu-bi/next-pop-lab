const https = require('https');
import type { GdeltArticle } from '../types';

function fetchGdeltArticles(query: string, hours: number, maxItems: number): Promise<GdeltArticle[]> {
  return new Promise((resolve, reject) => {
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&timespan=${hours}h&format=json&mode=ArtList`;
    
    https.get(url, (res: any) => {
      let data = '';
      
      res.on('data', (chunk: string) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (!data.trim().startsWith('{') && !data.trim().startsWith('[')) {
          if (data.includes('Your search') || data.includes('no results') || data.includes('No articles')) {
            console.log('指定された条件に該当する記事が見つかりませんでした。');
            resolve([]);
            return;
          } else {
            console.error('GDELT APIから予期しない応答を受信しました:', data.substring(0, 100) + '...');
            resolve([]);
            return;
          }
        }

        try {
          const jsonData = JSON.parse(data);
          
          if (!jsonData.articles || !Array.isArray(jsonData.articles)) {
            console.log('該当する記事が見つかりませんでした。');
            resolve([]);
            return;
          }
          
          const seenUrls = new Set<string>();
          const uniqueArticles: GdeltArticle[] = [];
          
          for (const article of jsonData.articles) {
            if (seenUrls.has(article.url)) {
              continue;
            }
            seenUrls.add(article.url);
            
            const gdeltArticle: GdeltArticle = {
              title: article.title || '',
              url: article.url || '',
              domain: article.domain,
              language: article.language,
              seendate: article.seendate,
              sourcecountry: article.sourcecountry
            };
            
            uniqueArticles.push(gdeltArticle);
            
            if (uniqueArticles.length >= maxItems) {
              break;
            }
          }
          
          resolve(uniqueArticles);
        } catch (error) {
          console.error('GDELT APIレスポンスの解析に失敗しました。検索条件を変更してお試しください。');
          resolve([]);
        }
      });
    }).on('error', (error: Error) => {
      console.error('GDELT API呼び出しでエラーが発生しました:', error.message);
      reject(error);
    });
  });
}

module.exports = {
  fetchGdeltArticles
};
