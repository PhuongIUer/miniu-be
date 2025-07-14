import { Expose } from "class-transformer";
import { User } from "../../users/entities/user.entity";

export class RegisterResponseDto extends User{
  @Expose()
  message: string
}