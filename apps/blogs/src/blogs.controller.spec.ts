import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';

describe('BlogsController', () => {
  let blogsController: BlogsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [BlogsService],
    }).compile();

    blogsController = app.get<BlogsController>(BlogsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      
    });
  });
});
