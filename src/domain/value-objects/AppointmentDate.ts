export class AppointmentDate {
  private readonly value: Date;

  private constructor(value: Date) {
    this.value = value;
  }

  static create(value: Date): AppointmentDate {
    return new AppointmentDate(value);
  }

  toDate(): Date {
    return this.value;
  }
}
