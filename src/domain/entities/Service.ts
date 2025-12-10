import { Identifier } from "../value-objects/Identifier"

type ServiceProps = {
  id: Identifier
  name: string
  duration: number
}

export class Service {
  readonly id: Identifier
  readonly name: string
  readonly duration: number

  constructor(props: ServiceProps) {
    this.id = props.id
    this.name = props.name
    this.duration = props.duration
  }
}
