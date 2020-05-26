import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [NewsModule, MongooseModule.forRoot('mongodb://localhost/nest'), CategoriesModule, CommentsModule],
})
export class AppModule {}
