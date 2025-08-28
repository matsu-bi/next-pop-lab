#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const dotenv = require('dotenv');

dotenv.config();

const argv = yargs(hideBin(process.argv))
  .scriptName('next-pop-lab')
  .usage('$0 <cmd> [args]')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .demandCommand(1, 'You need at least one command before moving on')
  .strict()
  .argv;

console.log('next-pop-lab CLI is ready!');
