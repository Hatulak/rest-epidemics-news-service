import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateNewsDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsOptional()
  cconst: string;
  @IsOptional()
  categoryId: string;
}
