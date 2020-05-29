import { Module } from '@nestjs/common';
import { NewsModule } from './news/news.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [
    NewsModule,
    MongooseModule.forRoot('mongodb://localhost/nest'),
    CategoriesModule,
    CommentsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
