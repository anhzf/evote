import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

concurrently([
  {
    name: 'shared',
    command: 'pnpm -C packages/shared dev',
  },
  process.argv.includes('--emulator') ? {
    name: 'emulator',
    command: 'pnpm start:emulator',
  } : undefined,
  {
    name: 'app',
    command: 'pnpm -C app dev',
  },
  {
    name: 'functions',
    command: 'pnpm -C functions dev',
  }
].filter(Boolean), {
  killOthers: ['failure', 'success'],
})
  .result.finally(() => { })
