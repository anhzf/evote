import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

concurrently([
  {
    name: 'shared',
    command: 'pnpm -C packages/shared build',
  },
  {
    name: 'app',
    command: 'pnpm -C app build',
  },
  {
    name: 'functions',
    command: 'pnpm -C functions build',
  }
])
  .result.finally(() => { })
