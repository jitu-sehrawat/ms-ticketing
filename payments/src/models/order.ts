import { OrderStatus } from '@jitusehrawattickets/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttr {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attr: OrderAttr): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      }
    }
  }
);

OrderSchema.set('versionKey', 'version');
OrderSchema.plugin(updateIfCurrentPlugin);

OrderSchema.statics.build = (attrs: OrderAttr) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
