import type { GdeltArticle, XPost, StanceCounts } from './types';

function renderMarkdown(topic: string, hours: number, summary: string, articles: GdeltArticle[], posts?: XPost[], stanceCounts?: StanceCounts, svgFilename?: string): string {
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
  
  if (posts && stanceCounts && svgFilename) {
    markdown += `## 海外ポストのスタンス集計\n\n`;
    markdown += `**ポスト数**: ${posts.length}件\n`;
    markdown += `**支持**: ${stanceCounts.support}件 | **反対**: ${stanceCounts.oppose}件 | **中立**: ${stanceCounts.neutral}件 | **不明**: ${stanceCounts.unknown}件\n\n`;
    
    markdown += `![スタンス分析結果](${svgFilename})\n\n`;
    
    markdown += `### 参考ポスト（最大10件）\n\n`;
    posts.slice(0, 10).forEach((post, index) => {
      markdown += `${index + 1}. **${post.text.substring(0, 100)}${post.text.length > 100 ? '...' : ''}**\n`;
      if (post.lang) {
        markdown += `   - 言語: ${post.lang}\n`;
      }
      if (post.like_count !== undefined) {
        markdown += `   - いいね数: ${post.like_count}\n`;
      }
      if (post.rt_count !== undefined) {
        markdown += `   - リツイート数: ${post.rt_count}\n`;
      }
      markdown += `\n`;
    });
  }
  
  markdown += `---\n\n`;
  markdown += `**著作権について**: この文書は要約＋短い引用＋出典リンクの形式で作成されており、全文転載は行っていません。詳細な内容については各出典リンクをご確認ください。\n`;
  
  return markdown;
}

module.exports = {
  renderMarkdown
};
