import { IsNumber } from "class-validator";

export class FindUserDto {
  @IsNumber()
  readonly id: number;
}
