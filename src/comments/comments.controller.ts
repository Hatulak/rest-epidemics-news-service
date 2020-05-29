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
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.model';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async addComment(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const saved = await this.commentsService.createComment(createCommentDto);
    return saved;
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const saved = await this.commentsService.updateComment(updateCommentDto);
    return saved;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteCommentById(@Param('id') id: string): Promise<void> {
    await this.commentsService.deleteById(id);
  }
}
