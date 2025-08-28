import type { GdeltArticle } from './types';

function renderMarkdown(topic: string, hours: number, summary: string, articles: GdeltArticle[]): string {
  const now = new Date();
  const timestamp = now.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  
  let markdown = `# ${topic} - 海外報道分析\n\n`;
  markdown += `**生成日時**: ${timestamp}\n`;
  markdown += `**検索期間**: 過去${hours}時間\n`;
  markdown += `**記事数**: ${articles.length}件\n\n`;
  
  markdown += `## 海外報道の要約\n\n`;
  markdown += `${summary}\n\n`;
  
  markdown += `## 出典リンク（抜粋）\n\n`;
  articles.forEach((article, index) => {
    markdown += `${index + 1}. **${article.title}**\n`;
    markdown += `   - URL: ${article.url}\n`;
    if (article.domain) {
      markdown += `   - ドメイン: ${article.domain}\n`;
    }
    if (article.language) {
      markdown += `   - 言語: ${article.language}\n`;
    }
    if (article.sourcecountry) {
      markdown += `   - 発信国: ${article.sourcecountry}\n`;
    }
    markdown += `\n`;
  });
  
  markdown += `---\n\n`;
  markdown += `**著作権について**: この文書は要約＋短い引用＋出典リンクの形式で作成されており、全文転載は行っていません。詳細な内容については各出典リンクをご確認ください。\n`;
  
  return markdown;
}

module.exports = {
  renderMarkdown
};
