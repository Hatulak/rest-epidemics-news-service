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
import { User } from 'src/users/user.model';
import { GetCommentsFilterDto } from './dto/get-comment-filter.dto';
import * as moment from 'moment';
@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comments') private readonly commentsModel: Model<Comment>,
    @InjectModel('News') private readonly newsModel: Model<News>,
  ) {}

  async getAllCommentsWithFilters(
    getCommentsFilterDto: GetCommentsFilterDto,
  ): Promise<Comment[]> {
    const {
      date,
      nconst,
      newsId,
      search,
      author,
      dateAfter,
      dateBefore,
    } = getCommentsFilterDto;

    let comments = await this.commentsModel.find().exec();
  
    if (nconst) {
      comments = comments.filter(c => c.nconst === nconst);
    }
    if (newsId) {
      const foundNConst = await this.getConstFromNews(newsId);
      comments = comments.filter(c => c.nconst === foundNConst);
    }
    if (author) {
      comments = comments.filter(c => c.author === author);
    }
    if (search) {
      comments = comments.filter(
        c => c.details.includes(search),
      );
    }
    if (date) {
      comments = comments.filter(c => moment(date).isSame(c.date, 'day'));
    }
    if (dateAfter && dateBefore) {
      comments = comments.filter(c =>
        moment(c.date).isBetween(dateAfter, dateBefore, 'day'),
      );
    } else if (dateAfter) {
      comments = comments.filter(c => moment(c.date).isAfter(dateAfter, 'day'));
    } else if (dateBefore) {
      comments = comments.filter(c =>
        moment(c.date).isBefore(dateBefore, 'day'),
      );
    }

    return comments;
  }

  async getAllComments(): Promise<Comment[]> {
    const result = await this.commentsModel.find().exec();
    return result;
  }

  getCommentById(id: string): Promise<Comment> {
    return this.findComment(id);
  }

  async createComment(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const { details, nconst, newsId } = createCommentDto;
    let newComment;
    if (nconst) {
      newComment = new this.commentsModel({
        details,
        nconst,
        author: user.username,
        date: new Date(),
      });
    } else if (newsId) {
      const foundNconst = await this.getConstFromNews(newsId);
      newComment = new this.commentsModel({
        details,
        author: user.username,
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
