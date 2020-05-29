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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Query,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { News, NewsStatus } from './news.model';
import { CreateNewsDto } from './dto/create-news.dto';
import { NewsStatusValidationPipe } from './pipes/news-status-validation.pipes';
import { UpdateNewsDto } from './dto/update-news.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v1 as uuid } from 'uuid';
import { GetNewsFilterDto } from './dto/get-news-filter.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getAllNews(@Query() getNewsFilterDto: GetNewsFilterDto): Promise<News[]> {
    if(Object.keys(getNewsFilterDto).length){
      return await this.newsService.getAllNewsWithFilters(getNewsFilterDto);
    }else{
      return await this.newsService.getAllNews();
    }
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

  @Get('/download/:path')
  @UseGuards(AuthGuard('jwt'))
  download(@Res() res, @Param('path') path: string) {
    res.sendFile(path, { root: 'uploads' }, err => {
      if (err) {
        res.status(err.status).end();
      }
    });
  }

  @Delete('/file/:path')
  @UseGuards(AuthGuard('jwt'))
  async deleteFile(
    @Body('newsId') id: string,
    @Param('path') path: string,
    @Res() res,
  ): Promise<News> {
    return await this.newsService.deleteFile(id, path, res);
  }

  @Post('/fileUpload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          return cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async fileUpload(
    @UploadedFile() file,
    @Body('newsId') id: string,
  ): Promise<News> {
    return await this.newsService.saveFilePath(id, file);
  }
}
