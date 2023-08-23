import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../models/blog.schema';

@Injectable()
export class BlogsRepository extends AbstractRepository<BlogDocument> {
  protected readonly logger = new Logger(BlogsRepository.name);

  constructor(
    @InjectModel(BlogDocument.name)
    blogModel: Model<BlogDocument>,
  ) {
    super(blogModel);
  }
}