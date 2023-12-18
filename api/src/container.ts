import { Container, injectable } from "inversify";
import pino from "pino";

export const container = new Container({ defaultScope: "Singleton" });
const logger = pino({
  name: "Container",
  level: "trace",
});
container.load();

export function addToContainer() {
  return function (target: any) {
    const temp = injectable()(target as any);
    container.bind(temp).toSelf();
    logger.trace(`${target.name} added to container`);
  };
}
