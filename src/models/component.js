import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: String,
  project: String,
  config: Object,
  // fileContent: String,
});


schema.statics.checkExistsByProjectAndName = function (project, name) {
  // 无力: ES6 箭头函数中的 this 指向有问题
  const self = this;
  return new Promise((resolve, reject) => {
    self.findOne({project: project, name: name}, function (err, component) {
      if (err) {
        reject(err);
      }
      if (component) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const Model = mongoose.model('component',schema);

export default Model;

