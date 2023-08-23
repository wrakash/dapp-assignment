import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogsRepository } from './blogs.repository';
import { CreateBlogDto } from '../dto/create-blog.dto';
import { UpdateBlogDto } from '../dto/update-blog.dto';
import { BlogDocument } from '../models/blog.schema';
import { DuplicateKeyException } from '@app/common';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BlogsRepository) private readonly blogRepository: BlogsRepository,
  ) {}

  // crud operation for user

  async create(createBlogDto: CreateBlogDto) {
    try {
      const indexing = await this.indexCreation(createBlogDto?.paragraphs);

      const data: BlogDocument = await this.blogRepository.create({
        ...createBlogDto,
        indexing,
      });
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB's duplicate key error code
        throw new DuplicateKeyException();
      }
      throw new HttpException('Internal server error', error.message);
    }
  }

  async findAll(keywords = []) {
    try {
      let query = {};

      if (keywords.length) {
        query = {
          keywords: {
            $in: keywords,
          },
        };
      }

      let data: BlogDocument[] = await this.blogRepository.find(query);
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async findOne(_id: string) {
    try {
      let data: BlogDocument = await this.blogRepository.findOne({ _id });
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async update(_id: string, updateReservationDto: UpdateBlogDto) {
    try {
      let data: BlogDocument = await this.blogRepository.findOneAndUpdate(
        { _id },
        { $set: updateReservationDto },
      );

      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  async remove(_id: string) {
    try {
      let data: BlogDocument = await this.blogRepository.findOneAndDelete({
        _id,
      });
      return {
        status: 'success',
        data: data,
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }

  private async indexCreation(paragraphs) {
    const indexies = await Promise.all(
      paragraphs.map((paragraph) => paragraph.title),
    );
    return indexies;
  }
}
