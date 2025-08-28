#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const dotenv = require('dotenv');
const { fetchGdeltArticles } = require('./services/gdelt');
const { fetchXPosts } = require('./services/x');
const { ollamaGenerate } = require('./services/ollama');
const { makeSummaryPrompt, makeStancePrompt } = require('./prompts');
const { renderMarkdown } = require('./render');
const { writeFile, nowStamp, sanitizeFilename } = require('./utils/fsutil');
const { barChartSVG } = require('./utils/svg');

dotenv.config();

const argv = yargs(hideBin(process.argv))
  .scriptName('next-pop-lab')
  .usage('$0 <cmd> [args]')
  .option('topic', {
    type: 'string',
    description: 'Search topic for GDELT articles'
  })
  .option('hours', {
    type: 'number',
    description: 'Time span in hours to search',
    default: 24
  })
  .option('maxArticles', {
    type: 'number',
    description: 'Maximum number of articles to fetch',
    default: 8
  })
  .option('ollamaModel', {
    type: 'string',
    description: 'Ollama model to use for summarization'
  })
  .option('withX', {
    type: 'boolean',
    description: 'Include X posts analysis',
    default: false
  })
  .option('xMax', {
    type: 'number',
    description: 'Maximum number of X posts to fetch',
    default: 80
  })
  .option('xLang', {
    type: 'string',
    description: 'Languages for X posts (comma-separated, e.g. "en,ja")'
  })
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .argv;

async function main() {
  if (argv.topic) {
    try {
      console.log(`GDELT記事を取得中: "${argv.topic}" (過去${argv.hours}時間, 最大${argv.maxArticles}件)`);
      
      const articles = await fetchGdeltArticles(argv.topic, argv.hours, argv.maxArticles);
      
      console.log(`\n取得した記事数: ${articles.length}件\n`);
      
      if (articles.length > 0) {
        console.log('先頭3件の記事:');
        articles.slice(0, 3).forEach((article: any, index: number) => {
          console.log(`${index + 1}. ${article.title}`);
          console.log(`   URL: ${article.url}\n`);
        });

        let posts: any[] = [];
        let stanceCounts: any = null;
        let svgFilename: string | undefined = undefined;

        if (argv.withX) {
          try {
            console.log(`Xポストを取得中: "${argv.topic}" (最大${argv.xMax}件)`);
            posts = await fetchXPosts(argv.topic, argv.xMax, argv.xLang);
            console.log(`取得したXポスト数: ${posts.length}件`);

            if (posts.length > 0 && argv.ollamaModel) {
              try {
                console.log(`Ollamaでスタンス分析中 (モデル: ${argv.ollamaModel})...`);
                const stancePrompt = makeStancePrompt(posts);
                const stanceResponse = await ollamaGenerate(argv.ollamaModel, stancePrompt);
                
                try {
                  stanceCounts = JSON.parse(stanceResponse.trim());
                  console.log('スタンス分析結果:', stanceCounts);
                } catch (parseError) {
                  console.log('スタンス分析のJSON解析に失敗しました。全て不明として処理します。');
                  stanceCounts = { support: 0, oppose: 0, neutral: 0, unknown: posts.length };
                }

                const svgContent = barChartSVG(stanceCounts);
                const timestamp = nowStamp();
                const sanitizedTopic = sanitizeFilename(argv.topic);
                svgFilename = `${timestamp}_${sanitizedTopic}_stance.svg`;
                const svgPath = `output/${svgFilename}`;
                
                writeFile(svgPath, svgContent);
                console.log(`SVGファイルを保存しました: ${svgPath}`);
                
              } catch (error) {
                console.error('スタンス分析に失敗しました:', error);
                stanceCounts = { support: 0, oppose: 0, neutral: 0, unknown: posts.length };
              }
            }
          } catch (error) {
            console.error('Xポストの取得に失敗しました:', error);
          }
        }

        if (argv.ollamaModel) {
          try {
            console.log(`Ollamaで要約を生成中 (モデル: ${argv.ollamaModel})...`);
            
            const prompt = makeSummaryPrompt(articles);
            const summary = await ollamaGenerate(argv.ollamaModel, prompt);
            
            console.log('\n要約:');
            console.log(summary);
            
            const markdown = renderMarkdown(argv.topic, argv.hours, summary, articles, posts, stanceCounts, svgFilename);
            const timestamp = nowStamp();
            const sanitizedTopic = sanitizeFilename(argv.topic);
            const filename = `output/${timestamp}_${sanitizedTopic}.md`;
            
            writeFile(filename, markdown);
            console.log(`\nMarkdownファイルを保存しました: ${filename}`);
            
          } catch (error) {
            console.error('要約生成またはファイル保存に失敗しました:', error);
            process.exit(1);
          }
        }
      } else {
        console.log('該当する記事が見つかりませんでした。');
      }
    } catch (error) {
      console.error('記事の取得に失敗しました:', error);
      process.exit(1);
    }
  } else {
    console.log('next-pop-lab CLI is ready!');
    console.log('使用例: npx ts-node src/index.ts --topic "defense budget Japan" --hours 24');
    console.log('Ollama使用例: npx ts-node src/index.ts --topic "防衛費 増額" --hours 24 --ollamaModel "qwen2.5:7b"');
    console.log('X統合使用例: npx ts-node src/index.ts --topic "防衛費 増額" --withX --xLang "en,ja" --ollamaModel "qwen2.5:7b"');
  }
}

main().catch(console.error);
