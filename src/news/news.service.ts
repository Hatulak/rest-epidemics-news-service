import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { News, NewsStatus } from './news.model';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateNewsDto } from './dto/update-news.dto';
import { v4 as uuid } from 'uuid';
import { Category } from 'src/categories/category.model';
import { User } from 'src/users/user.model';
import * as fs from 'fs';
import { GetNewsFilterDto } from './dto/get-news-filter.dto';
import * as moment from 'moment';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel('News') private readonly newsModel: Model<News>,
    @InjectModel('Categories')
    private readonly categoriesModel: Model<Category>,
  ) {}

  async getAllNewsWithFilters(
    getNewsFilterDto: GetNewsFilterDto,
  ): Promise<News[]> {
    const {
      status,
      date,
      cconst,
      categoryId,
      search,
      author,
      dateAfter,
      dateBefore,
    } = getNewsFilterDto;
    let news = await this.newsModel.find().exec();

    if (cconst) {
      news = news.filter(n => n.cconst === cconst);
    }
    if (status) {
      news = news.filter(n => n.status === status);
    }
    if (categoryId) {
      const foundCConst = await this.getCconstCategory(categoryId);
      news = news.filter(n => n.cconst === foundCConst);
    }
    if (author) {
      news = news.filter(n => n.author === author);
    }
    if (search) {
      news = news.filter(
        n => n.title.includes(search) || n.description.includes(search),
      );
    }
    if (date) {
      news = news.filter(n => moment(date).isSame(n.date, 'day'));
    }
    if (dateAfter && dateBefore) {
      news = news.filter(n =>
        moment(n.date).isBetween(dateAfter, dateBefore, 'day'),
      );
    } else if (dateAfter) {
      news = news.filter(n => moment(n.date).isAfter(dateAfter, 'day'));
    } else if (dateBefore) {
      news = news.filter(n => moment(n.date).isBefore(dateBefore, 'day'));
    }

    return news;
  }

  async getAllNews(): Promise<News[]> {
    const result = await this.newsModel.find().exec();
    return result;
  }

  getNewsById(id: string): Promise<News> {
    return this.findNews(id);
  }

  async createNews(createNewsDto: CreateNewsDto, user: User): Promise<News> {
    const { title, description, cconst, categoryId } = createNewsDto;
    let newNews;
    if (cconst) {
      newNews = new this.newsModel({
        title,
        description,
        nconst: uuid(),
        author: user.username,
        status: NewsStatus.CREATED,
        date: new Date(),
        cconst,
      });
    } else if (categoryId) {
      const foundCConst = await this.getCconstCategory(categoryId);
      newNews = new this.newsModel({
        title,
        description,
        nconst: uuid(),
        author: user.username,
        status: NewsStatus.CREATED,
        date: new Date(),
        cconst: foundCConst,
      });
    } else {
      throw new BadRequestException(
        'Could not find field with cconst or categoryId!',
      );
    }
    const saved = await newNews.save();
    return saved;
  }

  async deleteById(newsId: string) {
    const found = await this.findNews(newsId);
    const result = await this.newsModel.deleteOne({ _id: found._id }).exec();
  }

  async updateNewsStatus(id: string, status: NewsStatus): Promise<News> {
    const found = await this.findNews(id);
    found.status = status;
    const updated = await found.save();
    return updated;
  }

  async updateNews(updateNewsDto: UpdateNewsDto): Promise<News> {
    const {
      id,
      title,
      description,
      status,
      cconst,
      categoryId,
    } = updateNewsDto;
    const updatedNews = await this.findNews(id);
    if (title) {
      updatedNews.title = title;
    }
    if (status) {
      updatedNews.status = status;
    }
    if (description) {
      updatedNews.description = description;
    }
    if (cconst) {
      updatedNews.cconst = cconst;
    } else if (categoryId) {
      const foundCConst = await this.getCconstCategory(categoryId);
      updatedNews.cconst = foundCConst;
    }
    const saved = await updatedNews.save();
    return saved;
  }

  async saveFilePath(id: string, file) {
    const news = await this.findNews(id);
    news.file = file.filename;
    const saved = await news.save();
    return saved;
  }

  async deleteFile(id: string, path: string, res): Promise<News> {
    const news = await this.findNews(id);
    fs.unlink('./uploads/' + path, err => {
      if (err) {
        res.status(404).end();
      }
    });
    news.file = '';
    const saved = await news.save();
    return saved;
  }

  private async findNews(id: string): Promise<News> {
    let found;
    try {
      found = await this.newsModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find news with id: ' + id);
    }
    if (!found) {
      throw new NotFoundException('Could not find news with id: ' + id);
    }
    return found;
  }

  private async getCconstCategory(id: string): Promise<string> {
    let found;
    try {
      found = await this.categoriesModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Could not find category with id: ' + id);
    }
    if (!found) {
      throw new NotFoundException('Could not find category with id: ' + id);
    }
    return found.cconst;
  }
}
