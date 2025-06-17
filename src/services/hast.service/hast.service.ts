import * as hast from 'bcrypt';

export class HastService {

  static generateHast(password: string) {
    const salt = hast.genSaltSync(10);
    return hast.hash(password, salt);
  }


  static compare(userPassword: string, password: string) {
    return hast.compare(userPassword, password);
  }




}