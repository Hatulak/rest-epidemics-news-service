import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { NewsStatus } from '../news.model';
export class UpdateNewsDto {
  @IsNotEmpty()
  id: string;
  @IsOptional()
  title: string;
  @IsOptional()
  description: string;
  @IsOptional()
  @IsIn([NewsStatus.CREATED, NewsStatus.PUBLISHED])
  status: NewsStatus;
  @IsOptional()
  cconst: string;
  @IsOptional()
  categoryId: string;
}
