import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  type: String,
  githubId: String,
  githubProfile: Object
});

const Model = mongoose.model('User', schema);

export default Model;

