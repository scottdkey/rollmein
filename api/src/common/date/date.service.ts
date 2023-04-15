import { addToContainer } from "../../container"

@addToContainer()
export class DateService {

  now(input?: string | number) {
    if (input) {
      return new Date(input)
    }
    return new Date()
  }

  isoDiffFromNowToMs(iso: string) {
    return this.now(iso).getTime() - this.now().getTime()
  }

  getHoursFromNow(hours: number) {
    const now = this.now()
    return new Date(now.getTime() + (hours * 60 * 60 * 1000))
  }

  getDaysFromNow(days: number) {
    const today = this.now();
    const expire = this.now();
    return new Date(expire.setTime(today.getTime() + 3600000 * 24 * days))
  }

  secondsFromNumberOfHours(hours: number) {
    return hours * 3600
  }
  secondsFromNumberOfDays(days: number){
    const res = days * this.secondsFromNumberOfHours(24)
    return res
  }

  iso8601FromDate(date: Date) {
    return date.toISOString()
  }

  msFromIsoString(iso: string) {
    return this.now(iso).getTime()
  }


  msFromDate(date: Date) {
    return date.getTime()
  }

  dateFromIso8601(iso: string) {
    return new Date(iso)
  }

  //rounded
  msToMinutes(milliseconds: number) {
    return Math.floor(milliseconds / 1000 / 60)
  }

  lessThanNumberOfMinutesLeft(iso8601: string, minutes: number) {
    const msDiff = this.isoDiffFromNowToMs(iso8601)
    const minutesLeft = this.msToMinutes(msDiff)
    return minutesLeft < minutes
  }

}