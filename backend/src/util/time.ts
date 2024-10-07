export class TimeUtil {
  public static getUnixTimeForFutureDay(days: number): number {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return Math.floor(futureDate.getTime() / 1000);
  }
}
