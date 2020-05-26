import {
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.model';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAllComments(): Promise<Comment[]> {
    return await this.commentsService.getAllComments();
  }

  @Get(':id')
  async getCommentById(@Param('id') id: string): Promise<Comment> {
    return await this.commentsService.getCommentById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async addComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const saved = await this.commentsService.createComment(createCommentDto);
    return saved;
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const saved = await this.commentsService.updateComment(updateCommentDto);
    return saved;
  }

  @Delete(':id')
  async deleteCommentById(@Param('id') id: string): Promise<void> {
    await this.commentsService.deleteById(id);
  }
}
