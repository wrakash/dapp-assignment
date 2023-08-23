import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class BlogDocument extends AbstractDocument {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true}) // Specify the type for description
  description: string;

  @Prop([{ type: String, required: false}]) // Specify the type for keywords
  keywords: string[];

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  breadcrumbs: string;

  @Prop({ required: false })
  image: string;

  @Prop({
    required: true,
    type: {
      name: String,
      designation: String,
      updatedAt: String,
      description: String,
      imageUrl: String,
      linkedinUrl: String,
      twitterUrl: String,
    },
  })
  author: {
    name: string;
    designation: string;
    updatedAt: string;
    description: string;
    imageUrl: string;
    linkedinUrl: string;
    twitterUrl?: string;
  };

 
  @Prop({ required: true, type: Object })
  faq: object;

  @Prop([{ type: Object }])
  paragraphs: object[];

  @Prop([{ type: String, required: false}])
  indexing: string[];

  @Prop({
    required: true,
    type: {
      totalRate: { type: Number, default: 0 },
      avgRate: { type: Number, default: 0 },
    },
  })
  rate: {
    totalRate: number;
    avgRate: number;
  };
}

export const BlogSchema = SchemaFactory.createForClass(BlogDocument);
