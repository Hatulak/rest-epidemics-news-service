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
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './comment.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user.decorator';
import { GetCommentsFilterDto } from './dto/get-comment-filter.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/user.model';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getAllComments(
    @Query() getCommentsFilterDto: GetCommentsFilterDto,
  ): Promise<Comment[]> {
    if (Object.keys(getCommentsFilterDto).length) {
      return await this.commentsService.getAllCommentsWithFilters(
        getCommentsFilterDto,
      );
    } else {
      return await this.commentsService.getAllComments();
    }
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
    @GetUser() user,
  ): Promise<Comment> {
    const saved = await this.commentsService.createComment(
      createCommentDto,
      user,
    );
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.EDITOR)
  async deleteCommentById(@Param('id') id: string): Promise<void> {
    await this.commentsService.deleteById(id);
  }
}
