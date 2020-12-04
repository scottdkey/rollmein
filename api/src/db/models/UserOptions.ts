
const userOptionsTable = "options"

class UserOptions implements UserOptionsInterface {
  public id!: number;
  public rollType!: string;
  public lockAfterOut!: boolean;
  public theme!: string;
  public userId!: string;

  constructor(params: UserOptionsInterface) {
    this.id = params.id
    this.rollType = params.rollType
    this.lockAfterOut = params.lockAfterOut
    this.theme = params.theme
    this.userId = params.userId
  }

}
interface UserOptionsInterface {
  id: number;
  rollType: string;
  lockAfterOut: boolean;
  theme: string;
  userId: string;
}



export { UserOptions, UserOptionsInterface, userOptionsTable }

