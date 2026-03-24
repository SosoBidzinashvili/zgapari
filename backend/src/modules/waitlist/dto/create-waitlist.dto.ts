import { IsEmail, IsIn, IsOptional } from 'class-validator'

export class CreateWaitlistDto {
  @IsEmail()
  email!: string

  @IsOptional()
  @IsIn(['ka', 'en'])
  locale?: string
}
