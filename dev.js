import concurrently from 'concurrently';
import dotenv from 'dotenv';

dotenv.config()

const useEmulator = !!process.argv.includes('--emulator');
process.env.FIREBASE_EMULATOR = useEmulator;

concurrently([
  ...(useEmulator ? [
    {
      name: 'emulator',
      command: 'npm run start:emulator',
    },
    {
      name: 'functions',
      command: 'cd ./functions && npm run dev',
    }
  ] : []),
  {
    name: 'app',
    command: 'cd ./app && npm run dev',
  },
].filter(Boolean), {
  killOthers: ['failure', 'success'],
})
  .result.finally(() => { })
