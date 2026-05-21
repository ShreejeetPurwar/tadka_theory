import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  location: { lat: Number, lng: Number },
  items: Array,
  subtotal: Number,
  discount: Number,
  deliveryFee: Number,
  finalTotal: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);