import { Container, injectable } from "inversify";
import pino from "pino";

export const container = new Container({ defaultScope: "Singleton" });
const logger = pino({
  name: "container",
  level: "trace",
});
export function addToContainer() {
  return function (target: any) {
    logger.debug(`${target.name} added to container`);
    const temp = injectable()(target as any);
    container.bind(temp).toSelf();
  };
}
