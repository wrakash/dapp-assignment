import { JwtAuthGuard } from '@app/common';
import { AwsService } from './aws.service';
import {
  Controller,
  FileTypeValidator,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Response } from './interfaces/s3response.interface';

@Controller('aws')
export class AwsController {
  constructor(@Inject(AwsService) private readonly awsService: AwsService) {}

  //@UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 1.5MB allowed only
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<S3Response> {
    return await this.awsService.uploadFile(file);
  }
}
