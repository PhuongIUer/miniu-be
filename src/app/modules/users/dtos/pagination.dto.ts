import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class PaginationMetaDto {
  @Expose()
  totalItems: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}

export class PaginatedUsersDto {
  @Expose()
  @Type(() => UserDto)
  items: UserDto[];

  @Expose()
  @Type(() => PaginationMetaDto)
  meta: PaginationMetaDto;
} 