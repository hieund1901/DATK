export default class UserToken {
  _id: string;
  userId: any;
  accessToken: string;
  refreshToken: string;
  constructor(args: any = {}) {
    this._id = args._id;
    this.userId = args.userId;
    this.accessToken = args.accessToken;
    this.refreshToken = args.refreshToken;
  }
}