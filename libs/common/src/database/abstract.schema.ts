import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date, default: Date.now }) // createdAt field
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now }) // updatedAt field
  updatedAt?: Date;
}
