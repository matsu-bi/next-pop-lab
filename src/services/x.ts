const https = require('https');
import type { XPost } from '../types';

function fetchXPosts(query: string, maxItems: number, langsCsv?: string): Promise<XPost[]> {
  return new Promise((resolve, reject) => {
    const bearerToken = process.env.X_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.log('X_BEARER_TOKEN が設定されていないため、X機能をスキップします。');
      resolve([]);
      return;
    }

    let searchQuery = `(${query}) -is:retweet`;
    if (langsCsv) {
      const langs = langsCsv.split(',').map(lang => `lang:${lang.trim()}`).join(' OR ');
      searchQuery += ` (${langs})`;
    }

    const params = new URLSearchParams({
      query: searchQuery,
      max_results: Math.min(maxItems, 100).toString(),
      'tweet.fields': 'created_at,public_metrics,lang'
    });

    const options = {
      hostname: 'api.x.com',
      port: 443,
      path: `/2/tweets/search/recent?${params.toString()}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res: any) => {
      let data = '';

      res.on('data', (chunk: string) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          if (jsonData.errors) {
            console.error('X API エラー:', jsonData.errors);
            resolve([]);
            return;
          }

          if (!jsonData.data || !Array.isArray(jsonData.data)) {
            console.log('該当するXポストが見つかりませんでした。');
            resolve([]);
            return;
          }

          const posts: XPost[] = jsonData.data.map((tweet: any) => ({
            id: tweet.id,
            text: tweet.text,
            lang: tweet.lang,
            created_at: tweet.created_at,
            like_count: tweet.public_metrics?.like_count,
            rt_count: tweet.public_metrics?.retweet_count
          }));

          resolve(posts.slice(0, maxItems));
        } catch (error) {
          console.error('X APIレスポンスの解析に失敗しました:', error);
          resolve([]);
        }
      });
    });

    req.on('error', (error: Error) => {
      console.error('X API呼び出しでエラーが発生しました:', error.message);
      resolve([]);
    });

    req.end();
  });
}

module.exports = {
  fetchXPosts
};
