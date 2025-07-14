export interface Bcrypt {
  hash(password: string, saltOrRounds: number | string): Promise<string>;
  compare(data: string, encrypted: string): Promise<boolean>;
  genSalt(rounds?: number): Promise<string>;
}