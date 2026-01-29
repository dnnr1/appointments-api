import { Identifier } from "../value-objects/Identifier";

type UserProps = {
  id: Identifier;
  name: string;
  email: string;
  passwordHash: string;
};

export class User {
  readonly id: Identifier;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
  }
}
