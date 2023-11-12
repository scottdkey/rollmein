import { Container, injectable } from "inversify";

export const container = new Container({ defaultScope: "Singleton" });

export function addToContainer() {
  return function (target: any) {
    console.info(`${target.name} added to container`);
    const temp = injectable()(target as any);
    container.bind(temp).toSelf();
  };
}
