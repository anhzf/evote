import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

concurrently([
  {
    name: 'core:esm',
    command: 'npm run -w core dev',
  },
  {
    name: 'core:cjs',
    command: 'npm run -w core dev:cjs',
  },
  {
    name: 'fe',
    command: 'npm run -w front-end dev',
  },
  {
    name: 'emulator',
    command: 'npm run emulator:start',
  },
  {
    name: 'functions',
    command: 'npm run -w functions dev',
  }
], {
  killOthers: ['failure', 'success'],
})
  .result.finally(() => {})
