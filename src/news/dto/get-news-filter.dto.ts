import { NewsStatus } from '../news.model';
import { IsOptional, IsIn } from 'class-validator';

export class GetNewsFilterDto {
  @IsOptional()
  @IsIn([NewsStatus.CREATED, NewsStatus.PUBLISHED])
  status: NewsStatus;
  @IsOptional()
  search: string;
  @IsOptional()
  author: string;
  @IsOptional()
  cconst: string;
  @IsOptional()
  categoryId: string;
  @IsOptional()
  date: Date;
  @IsOptional()
  dateAfter: Date;
  @IsOptional()
  dateBefore: Date;
}
