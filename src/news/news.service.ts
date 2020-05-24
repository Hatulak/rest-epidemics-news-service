import { Injectable, NotFoundException } from '@nestjs/common';
import { News, NewsStatus } from './news.model';
import { stat } from 'fs';
import { CreateNewsDto } from './dto/create-news.dto';

@Injectable()
export class NewsService {
  private news: News[] = [];

  getAllNews(): News[] {
    return this.news;
  }

  getNewsById(id: string): News {
    return this.findNews(id)[0];
  }

  createNews(createNewsDto: CreateNewsDto): News {
    const { title, description } = createNewsDto;
    const n_news: News = {
      id: Math.random().toString(),
      title,
      description,
      status: NewsStatus.CREATED,
      date: new Date(),
    };
    this.news.push(n_news);
    return n_news;
  }

  deleteById(id: string) {
    const found = this.findNews(id)[0];
    this.news = this.news.filter(n => n.id !== found.id);
  }

  updateNewsStatus(id: string, status: NewsStatus): News {
    const updated = this.findNews(id)[0];
    updated.status = status;
    return updated;
  }

  updateNews(
    id: string,
    title: string,
    description: string,
    status: string,
  ): News {
    const [news, index] = this.findNews(id);
    const updatedNews = { ...news };
    this.news[index] = { ...news };
    return updatedNews;
  }

  private findNews(id: string): [News, number] {
    const index = this.news.findIndex(n => n.id === id);
    const found = this.news[index];
    if (!found) {
      throw new NotFoundException('Could not find news with id: ' + id);
    }
    return [found, index];
  }
}
