import type { GdeltArticle } from './types';

function makeSummaryPrompt(articles: GdeltArticle[]): string {
  const articleList = articles.map((article, index) => {
    return `${index + 1}. タイトル: ${article.title}\n   URL: ${article.url}\n   ドメイン: ${article.domain || 'N/A'}\n   言語: ${article.language || 'N/A'}`;
  }).join('\n\n');

  return `以下の海外報道記事を分析し、日本語で3-7項目の箇条書き要約を作成してください。

記事一覧:
${articleList}

要求事項:
- 日本語で回答してください
- 3-7項目の箇条書き形式で要約してください
- 各項目は簡潔で分かりやすくしてください
- 主要なポイントや傾向を抽出してください
- 客観的な視点で要約してください

要約:`;
}

module.exports = {
  makeSummaryPrompt
};
