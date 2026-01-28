import dayjs from "dayjs";
import { DateProvider } from "../../application/interfaces/DateProvider";

export class DayjsDateProvider implements DateProvider {
  now(): Date {
    return dayjs().toDate();
  }

  isBefore(a: Date, b: Date): boolean {
    return dayjs(a).isBefore(b);
  }

  diffInHours(a: Date, b: Date): number {
    return dayjs(a).diff(b, "hour");
  }

  startOfDay(date: Date): Date {
    return dayjs(date).startOf("day").toDate();
  }

  endOfDay(date: Date): Date {
    return dayjs(date).endOf("day").toDate();
  }
}
