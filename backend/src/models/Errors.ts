export class BlockchainValidationError extends Error {
  public errors: string[];

  constructor(errors: string[]) {
    super('Blockchain validation failed');
    this.name = 'BlockchainValidationError';
    this.errors = errors;
  }
}
