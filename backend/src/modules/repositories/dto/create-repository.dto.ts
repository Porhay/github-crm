import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRepositoryDto {
  @IsString()
  @IsNotEmpty()
  path: string;
} 