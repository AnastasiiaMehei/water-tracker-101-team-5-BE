import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema({
  rate: {
    type: String,
    enum: ['For woman', 'For man'],
    default: 'For woman',
  },
  drinkWater: {
    type: Number,
    required: true,
  },
});

export const waterCollection = mongoose.model('Water', waterSchema);
