import { IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-z]+[a-z0-9]{3,15}$/i, {
    message: 'incorrect username'
  })
  readonly username: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{6,12}$/, {
    message: 'incorrect password'
  })
  readonly password: string;
}
