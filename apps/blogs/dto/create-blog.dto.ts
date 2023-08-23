import {
  IsString,
  IsDate,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AuthorDto {
  @IsString()
  name: string;

  @IsString()
  designation: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  linkedinUrl: string;

  @IsString()
  twitterUrl: string;

  @IsDate()
  updatedAt: Date;
}

export class RateDto {
  @IsNumber()
  totalRate: number;

  @IsNumber()
  avgRate: number;
}

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsOptional()
  keywords: [];

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  @IsString()
  breadcrumbs: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsObject()
  @IsNotEmpty()
  author: {
    name: string;
    designation: string;
    updatedAt: string;
    description: string;
    imageUrl: string;
    linkedinUrl: string;
    twitterUrl: string;
  };

  @IsArray()
  @IsNotEmpty()
  faq: object[];

  @IsArray()
  paragraphs: object[];

  @IsArray()
  @IsOptional()
  indexing: string[];

  @IsObject()
  rate: {
    totalRate: number;
    avgRate: number;
  };
}
