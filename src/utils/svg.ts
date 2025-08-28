import type { StanceCounts } from '../types';

function barChartSVG(counts: StanceCounts): string {
  const total = counts.support + counts.oppose + counts.neutral + counts.unknown;
  const maxCount = Math.max(counts.support, counts.oppose, counts.neutral, counts.unknown);
  
  if (total === 0) {
    return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <text x="200" y="150" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">データがありません</text>
</svg>`;
  }

  const barWidth = 80;
  const barSpacing = 20;
  const chartHeight = 200;
  const chartTop = 50;
  const chartWidth = 4 * barWidth + 3 * barSpacing;
  const svgWidth = chartWidth + 40;
  const svgHeight = chartHeight + 100;

  const categories = [
    { key: 'support', label: '支持', count: counts.support, color: '#4CAF50' },
    { key: 'oppose', label: '反対', count: counts.oppose, color: '#F44336' },
    { key: 'neutral', label: '中立', count: counts.neutral, color: '#FF9800' },
    { key: 'unknown', label: '不明', count: counts.unknown, color: '#9E9E9E' }
  ];

  let svg = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;
  
  svg += `<rect width="${svgWidth}" height="${svgHeight}" fill="white"/>`;
  
  svg += `<text x="${svgWidth/2}" y="30" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="#333">スタンス分析結果</text>`;

  categories.forEach((category, index) => {
    const x = 20 + index * (barWidth + barSpacing);
    const barHeight = maxCount > 0 ? (category.count / maxCount) * (chartHeight - 40) : 0;
    const y = chartTop + (chartHeight - 40) - barHeight;

    svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${category.color}"/>`;
    
    svg += `<text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#333">${category.count}</text>`;
    
    svg += `<text x="${x + barWidth/2}" y="${chartTop + chartHeight + 15}" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">${category.label}</text>`;
    
    const percentage = total > 0 ? Math.round((category.count / total) * 100) : 0;
    svg += `<text x="${x + barWidth/2}" y="${chartTop + chartHeight + 30}" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">(${percentage}%)</text>`;
  });

  svg += `<text x="${svgWidth/2}" y="${svgHeight - 10}" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">総ポスト数: ${total}件</text>`;

  svg += '</svg>';
  
  return svg;
}

module.exports = {
  barChartSVG
};
