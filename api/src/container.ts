import { Container, injectable } from "inversify";
import { LoggerService } from "./logger/logger.service";
import { DateService } from "./common/date/date.service";

export const container = new Container({ defaultScope: "Singleton" });
const logger = new LoggerService(new DateService()).getLogger("container");

export function addToContainer() {
  return function (target: any) {
    const temp = injectable()(target as any);
    container.bind(temp).toSelf();
    logger.trace(`${target.name} added to container`);
  };
}
