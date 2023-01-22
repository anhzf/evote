import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

const useEmulator = process.argv.includes('--emulator')
process.env.FIREBASE_EMULATOR = useEmulator

concurrently([
  {
    name: 'shared',
    command: 'pnpm -C packages/shared dev',
  },
  useEmulator && {
    name: 'emulator',
    command: 'pnpm start:emulator',
  },
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
