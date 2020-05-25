import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsSchema } from './news.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'News',  schema: NewsSchema}])],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
