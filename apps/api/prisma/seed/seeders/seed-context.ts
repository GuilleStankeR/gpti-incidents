export interface SeedContext {
  readonly condominiumId: string;
  readonly condominiumCode: string;
  readonly storageDirectory: string;
  readonly timeZone: string;
  readonly now: Date;
}

export interface SeedUser {
  readonly id: string;
  readonly name: string;
}

export type UserLookup = (email: string) => SeedUser;

export interface WriterContext extends SeedContext {
  readonly findUser: UserLookup;
}
