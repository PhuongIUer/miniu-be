import { Inject, Injectable } from "@nestjs/common";
import { Bcrypt } from "../../../common/interfaces/bcrypt.interface";

@Injectable()
export class PasswordService{
  constructor(@Inject('bcrypt')private bcrypt: Bcrypt){}

  comparePassword(firstPassword: string, secondPassord: string): Promise<boolean>{
    return this.bcrypt.compare(firstPassword, secondPassord);
  }

  async hashPassword(password: string, rounds: number): Promise<string>{
    const salt = await this.bcrypt.genSalt(rounds);
    const hashedPassword = await this.bcrypt.hash(password, salt);
    return hashedPassword;
  }
}