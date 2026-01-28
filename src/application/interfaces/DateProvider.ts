export interface DateProvider {
  now(): Date;
  isBefore(a: Date, b: Date): boolean;
  diffInHours(a: Date, b: Date): number;
  startOfDay(date: Date): Date;
  endOfDay(date: Date): Date;
}
