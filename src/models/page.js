import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: String,
  description: String,
  components: [Schema.Types.Mixed],
  project: String,
  owner: String,
  config: Object
});

schema.statics.checkExistsByProjectAndName = function (project, name) {
  // 无力: ES6 箭头函数中的 this 指向有问题
  const self = this;
  return new Promise((resolve, reject) => {
    self.findOne({project: project, name: name}, function (err, page) {
      if (err) {
        reject(err);
      }
      if (page) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const Model = mongoose.model('page', schema);

export default Model;

