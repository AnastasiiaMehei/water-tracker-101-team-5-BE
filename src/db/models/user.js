import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    photo: { type: String, default: null },
    gender: {
      type: String,
      enum: ['Woman', 'Man'],
      default: 'Woman',
    },
    name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dailyNorma: {
      type: Number,
      default: 1500,
    },
  },
  { timestamps: true, versionKey: false },
);
usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
