import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './comment.model';
import { NewsSchema } from 'src/news/news.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comments', schema: CommentSchema },
      { name: 'News', schema: NewsSchema },
    ]),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
