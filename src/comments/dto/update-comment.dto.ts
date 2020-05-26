import { IsNotEmpty, IsOptional } from 'class-validator';
export class UpdateCommentDto {
  @IsNotEmpty()
  id: string;
  @IsOptional()
  details: string;
  @IsOptional()
  nconst: string;
  @IsOptional()
  newsId: string;
}
