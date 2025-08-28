import type { GdeltArticle, XPost } from './types';

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

function makeStancePrompt(posts: XPost[]): string {
  const postList = posts.map((post, index) => {
    return `${index + 1}. テキスト: ${post.text}\n   言語: ${post.lang || 'N/A'}\n   いいね数: ${post.like_count || 0}`;
  }).join('\n\n');

  return `以下のXポストを分析し、指定されたトピックに対するスタンス（立場）を分類してください。

ポスト一覧:
${postList}

要求事項:
- 各ポストを「支持」「反対」「中立」「不明」の4つのカテゴリに分類してください
- 結果は必ずJSON形式で返してください
- JSON以外の文字は一切含めないでください
- 形式: {"support":数値,"oppose":数値,"neutral":数値,"unknown":数値}

JSON:`;
}

module.exports = {
  makeSummaryPrompt,
  makeStancePrompt
};
