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
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News, NewsStatus } from './news.model';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsStatusValidationPipe } from './pipes/news-status-validation.pipes';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  getAllNews(): News[] {
    return this.newsService.getAllNews();
  }

  @Get(':id')
  getNewsById(@Param('id') id: string): News {
    return this.newsService.getNewsById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  addNews(@Body() createNewsDto: CreateNewsDto): News {
    return this.newsService.createNews(createNewsDto);
  }

  @Delete(':id')
  deleteNewsById(@Param('id') id: string): void {
    return this.newsService.deleteById(id);
  }

  @Patch(':id/status')
  updateNewsStatus(
    @Param('id') id: string,
    @Body('status',NewsStatusValidationPipe) status: NewsStatus,
  ): News {
    return this.newsService.updateNewsStatus(id, status);
  }
}
