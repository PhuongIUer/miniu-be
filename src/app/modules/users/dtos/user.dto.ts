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
    major: string;
    
    @Expose()
    position: string;
    
    @Expose()
    office: string;

    @Expose()
    @Type(()=>RoleDto)  
    role: RoleDto;
}