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
  UseGuards,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News, NewsStatus } from './news.model';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsStatusValidationPipe } from './pipes/news-status-validation.pipes';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user.decorator';

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
  @UseGuards(AuthGuard('jwt'))
  async addNews(
    @GetUser() user,
    @Body() createNewsDto: CreateNewsDto,
  ): Promise<News> {
    const saved = await this.newsService.createNews(createNewsDto, user);
    return saved;
  }

  @Put()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  async updateNews(@Body() updateNewsDto: UpdateNewsDto): Promise<News> {
    const saved = await this.newsService.updateNews(updateNewsDto);
    return saved;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteNewsById(@Param('id') id: string): Promise<void> {
    await this.newsService.deleteById(id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async updateNewsStatus(
    @Param('id') id: string,
    @Body('status', NewsStatusValidationPipe) status: NewsStatus,
  ): Promise<News> {
    return await this.newsService.updateNewsStatus(id, status);
  }
}
