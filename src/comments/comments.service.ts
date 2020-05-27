import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { News } from 'src/news/news.model';
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comments') private readonly commentsModel: Model<Comment>,
    @InjectModel('News') private readonly newsModel: Model<News>,
  ) {}
  async getAllComments(): Promise<Comment[]> {
    const result = await this.commentsModel.find().exec();
    return result;
  }

  getCommentById(id: string): Promise<Comment> {
    return this.findComment(id);
  }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { details, nconst, newsId } = createCommentDto;
    let newComment;
    if (nconst) {
      newComment = new this.commentsModel({
        details,
        nconst,
        date: new Date(),
      });
    } else if (newsId) {
      const foundNconst = await this.getConstFromNews(newsId);
      newComment = new this.commentsModel({
        details,
        nconst: foundNconst,
        date: new Date(),
      });
    } else {
      throw new BadRequestException(
        'Could not find field with nconst or newsId!',
      );
    }

    const saved = await newComment.save();
    return saved;
  }

  async deleteById(commentId: string) {
    const found = await this.findComment(commentId);
    const result = await this.commentsModel
      .deleteOne({ _id: found._id })
      .exec();
  }

  async updateComment(updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const { id, details, nconst, newsId } = updateCommentDto;
    const updatedComment = await this.findComment(id);
    if (details) {
      updatedComment.details = details;
    }
    if (nconst) {
      updatedComment.nconst = nconst;
    }
    if (newsId) {
      const foundNconst = await this.getConstFromNews(newsId);
      updatedComment.nconst = foundNconst;
    }
    const saved = await updatedComment.save();
    return saved;
  }

  private async findComment(id: string): Promise<Comment> {
    let found;
    try {
      found = await this.commentsModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find category with id: ' + id);
    }
    if (!found) {
      throw new NotFoundException('Could not find category with id: ' + id);
    }
    return found;
  }

  private async getConstFromNews(id: string): Promise<string> {
    let found;
    try {
      found = await this.newsModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find news with id: ' + id);
    }
    if (!found) {
      throw new NotFoundException('Could not find news with id: ' + id);
    }
    return found.nconst;
  }
}
