import { v4 as uuidv4 } from "uuid";

export class Identifier {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value?: string): Identifier {
    return new Identifier(value ?? uuidv4());
  }

  toString(): string {
    return this.value;
  }
}
