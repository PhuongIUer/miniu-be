import {
  UseInterceptors,
  CallHandler,
  ExecutionContext,
  NestInterceptor
 } from "@nestjs/common";

import { Observable} from "rxjs";
import { map } from "rxjs/operators";
import { ClassConstructor, plainToInstance } from "class-transformer";


export function Serialize(dto: ClassConstructor<any>){  
  return UseInterceptors(new SerializeInterceptor(dto))
}
export class SerializeInterceptor implements NestInterceptor{
  
  constructor(private dto: any){}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true
        })
      }),
    );
  }
}