
const userOptionsTable = "user-options"

class UserOptions {
  public id!: number;
  public rollType!: string;
  public lockAfterOut!: boolean;
  public theme!: string;
  public userID!: string;

}
interface UserOptionsInterface {
  id: number;
  rollType: string;
  lockAfterOut: boolean;
  theme: string;
  userID: string;
}



export { UserOptions, UserOptionsInterface, userOptionsTable }

