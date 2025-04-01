export class ClientError extends Error {
  constructor(public code: number, message: string, cause?: any) {
    super(message, { cause });
  }
}
