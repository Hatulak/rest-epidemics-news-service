import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
export class UpdateCategoryDto {
  @IsNotEmpty()
  id: string;
  @IsOptional()
  name: string;
}
