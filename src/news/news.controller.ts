import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News, NewsStatus } from './news.model';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsStatusValidationPipe } from './pipes/news-status-validation.pipes';
import { UpdateNewsDto } from './dto/update-news.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  async getAllNews(): Promise<News[]> {
    return await this.newsService.getAllNews();
  }

  @Get(':id')
  async getNewsById(@Param('id') id: string): Promise<News> {
    return await this.newsService.getNewsById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async addNews(@Body() createNewsDto: CreateNewsDto): Promise<News> {
    const saved = await this.newsService.createNews(createNewsDto);
    return saved;
  }

  @Put()
  @UsePipes(ValidationPipe)
  async updateNews(@Body() updateNewsDto: UpdateNewsDto): Promise<News> {
    const saved = await this.newsService.updateNews(updateNewsDto);
    return saved;
  }

  @Delete(':id')
  async deleteNewsById(@Param('id') id: string): Promise<void> {
    await this.newsService.deleteById(id);
  }

  @Patch(':id/status')
  async updateNewsStatus(
    @Param('id') id: string,
    @Body('status', NewsStatusValidationPipe) status: NewsStatus,
  ): Promise<News> {
    return await this.newsService.updateNewsStatus(id, status);
  }
}
