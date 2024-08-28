import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema({
  rate: {
    type: String,
    enum: ['For woman', 'For man'],
    default: 'For woman',
  },
  weight: {
    type: Number,
    required: true,
  },
  sportParticipation: {
    type: Number,
    required: true,
  },
  drinkWater: {
    type: Number,
    required: true,
  },
});

export const contactsCollection = mongoose.model('Water', waterSchema);
