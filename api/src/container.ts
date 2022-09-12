import { Container, injectable } from 'inversify'

export const container = new Container({ defaultScope: 'Singleton' })

export function addToContainer() {
  return function (target: any) {
    const temp = injectable()(target)
    container.bind(temp).toSelf()
  }
}