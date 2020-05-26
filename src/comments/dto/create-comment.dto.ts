import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty()
  details: string;
  @IsOptional()
  newsId: string;
  @IsOptional()
  nconst: string;
}
