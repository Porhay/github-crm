import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateRepositoryDto {
  @IsString()
  @IsNotEmpty()
  path: string;
} 