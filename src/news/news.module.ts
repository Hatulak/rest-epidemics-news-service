import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './news.model';
import { CategorySchema } from 'src/categories/category.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'News', schema: NewsSchema },
      { name: 'Categories', schema: CategorySchema },
    ]),
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule {}
