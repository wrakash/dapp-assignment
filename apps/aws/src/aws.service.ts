import * as AWS from 'aws-sdk';
import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Response } from './interfaces/s3response.interface';



@Injectable()
export class AwsService {
  constructor(private readonly configService: ConfigService) {}

  AWS_S3_BUCKET = this.configService.getOrThrow('S3_BUCKET_NAME');
  s3 = new AWS.S3({
    accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.getOrThrow('AWS_ACCESS_KEY_SECRET'),
  });

  async uploadFile(file) : Promise<S3Response> {
    const { originalname } = file;
    return await this.s3_upload2(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }


  //best for small files
  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: this.configService.getOrThrow('AWS_S3_REGION'),
      },
    };

    try {
      let s3Response = await this.s3.upload(params).promise();
      return {
        status: 'success',
        data: {
          url: s3Response.Location,
          name: s3Response.Key,
        },
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }


  //best for large files
  async s3_upload2(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
    };
  
    try {
      const uploadId = await this.s3.createMultipartUpload(params).promise();
  
      const partSize = 5 * 1024 * 1024; // 5MB chunks
      const numParts = Math.ceil(file.length / partSize);
  
      const uploadPromises = [];
      for (let i = 0; i < numParts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, file.length);
        const part = file.slice(start, end);
  
        const uploadParams = {
          ...params,
          PartNumber: i + 1,
          UploadId: uploadId.UploadId,
          Body: part,
        };
  
        const uploadPromise = this.s3.uploadPart(uploadParams).promise();
        uploadPromises.push(uploadPromise);
      }
  
      const uploadedParts = await Promise.all(uploadPromises);
      const completedParams = {
        ...params,
        UploadId: uploadId.UploadId,
        MultipartUpload: { Parts: uploadedParts.map((part, index) => ({ ETag: part.ETag, PartNumber: index + 1 })) },
      };
  
      await this.s3.completeMultipartUpload(completedParams).promise();
  
      return {
        status: 'success',
        data: {
          url: `https://${bucket}.s3.amazonaws.com/${name}`,
          name,
        },
      };
    } catch (error) {
      throw new HttpException('Internal server error', error.message);
    }
  }
  
}
