export default class User {
  _id: string;
  name: string;
  email: string;
  password: string;
  constructor(args: any = {}) {
    this._id = args._id;
    this.name = args.name;
    this.email = args.email;
    this.password = args.password;
  }
}