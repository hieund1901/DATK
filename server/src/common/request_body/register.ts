export class RegisterRequest {
    name: string;
    email: string;
    password: string;
    dateOfBirth: string;
    gender: string;

    // constructor(email: string, password: string, dateOfBirth: string, gender: string) {
    //     this.email = email;
    //     this.password = password;
    //     this.dateOfBirth = dateOfBirth;
    //     this.gender = gender;
    // }
    constructor(args: { email: string, password: string, dateOfBirth: string, gender: string, name: string }) {
        this.name = args.name;
        this.email = args.email;
        this.password = args.password;
        this.dateOfBirth = args.dateOfBirth;
        this.gender = args.gender;

    }
}

export const schema = {
    email: 'anle',
    password: '',
    dateOfBirth: '',
    gender: ''
}