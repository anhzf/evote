import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

concurrently([
  {
    name: 'core:esm',
    command: 'npm run -w core build',
  },
  {
    name: 'core:cjs',
    command: 'npm run -w core build:cjs',
  },
  {
    name: 'fe',
    command: 'npm run -w front-end build',
  },
  {
    name: 'functions',
    command: 'npm run -w functions build',
  }
])
  .result.finally(() => {})
