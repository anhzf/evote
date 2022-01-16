import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

concurrently([
  {
    name: 'core',
    command: 'npm run core:dev',
  },
  {
    name: 'fe',
    command: 'npm run fe:dev',
  },
  {
    name: 'emulator',
    command: 'npm run emulator:start',
  },
], {
  killOthers: ['failure', 'success'],
})
  .result.finally(() => {})
