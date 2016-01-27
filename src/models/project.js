import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: String,
  description: String,
  baseUrl: String,
  owner: String,
  publishIp: String,
  publishPath: String,
  rsyncUsername: String,
  rsyncPassword: String,
});

schema.statics.checkExistsByName = function (name) {
  // 无力: ES6 箭头函数中的 this 指向有问题
  const self = this;
  return new Promise((resolve, reject) => {
    self.findOne({name: name}, function (err, project) {
      if (err) {
        reject(err);
      }
      if (project) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const Model = mongoose.model('project', schema);



export default Model;

