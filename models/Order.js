import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  items: { type: Array, required: true },
  subtotal: { type: Number, required: true },
  discount: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  finalTotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);