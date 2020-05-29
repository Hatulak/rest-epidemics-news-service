import { IsOptional } from 'class-validator';

export class GetCommentsFilterDto {
  @IsOptional()
  search: string;
  @IsOptional()
  author: string;
  @IsOptional()
  nconst: string;
  @IsOptional()
  newsId: string;
  @IsOptional()
  date: Date;
  @IsOptional()
  dateAfter: Date;
  @IsOptional()
  dateBefore: Date;
}
