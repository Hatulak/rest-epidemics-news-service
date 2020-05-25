import { Injectable, NotFoundException } from '@nestjs/common';
import { News, NewsStatus } from './news.model';
import { CreateNewsDto } from './dto/create-news.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel('News') private readonly newsModel: Model<News>) {}
  private news: News[];
  async getAllNews(): Promise<News[]> {
    const result = await this.newsModel.find().exec();
    return result;
  }

  getNewsById(id: string): Promise<News> {
    return this.findNews(id);
  }

  async createNews(createNewsDto: CreateNewsDto): Promise<News> {
    const { title, description } = createNewsDto;
    const newNews = new this.newsModel({
      title,
      description,
      status: NewsStatus.CREATED,
      date: new Date(),
    });
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
    const { id, title, description, status } = updateNewsDto;
    const updatedNews = await this.findNews(id);
    if (title){
      updatedNews.title = title;
    }
    if (status){
      updatedNews.status = status;
    }
    if (description){
      updatedNews.description = description;
    }
    const saved = await updatedNews.save();
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
}
