#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const dotenv = require('dotenv');
const { fetchGdeltArticles } = require('./services/gdelt');

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
  }
}

main().catch(console.error);
