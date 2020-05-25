import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [NewsModule, MongooseModule.forRoot('mongodb://localhost/nest')],
})
export class AppModule {}
