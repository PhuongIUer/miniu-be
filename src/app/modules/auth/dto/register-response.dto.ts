import { Expose } from "class-transformer";
import { User } from "../../users/entities/user.entity";

export class RegisterResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  role: string; // hoặc bất kỳ trường nào bạn muốn hiển thị

  @Expose()
  message: string;
}