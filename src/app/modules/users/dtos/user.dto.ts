import { Expose, Type } from "class-transformer";
import { RoleDto } from "../../roles/dtos/role.dto";

export class UserDto{
    @Expose()
    id: number;
  
    @Expose()
    email: string;
  
    @Expose()
    userName: string;
    
    @Expose()
    avatar: string;

    @Expose()
    isVerified: boolean;

    @Expose()
    isBlocked: boolean;
    @Expose()
    @Type(()=>RoleDto)  
    role: RoleDto;
}