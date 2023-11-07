import concurrently from 'concurrently'
import dotenv from 'dotenv'

dotenv.config()

concurrently([
  {
    name: 'app',
    command: 'cd ./app && npm run build',
  },
  {
    name: 'functions',
    command: 'cd ./functions && npm run build',
  }
])
  .result.finally(() => { })
