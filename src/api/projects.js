import { Router } from 'express';
import Project from '../models/project';
const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find({});
    res.status(200).send({
      retcode: 0,
      title: '项目列表',
      projects: projects
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const exists = await Project.checkExistsByName(req.body.name);
    if (exists) {
      res.status(200).send({
        retcode: 10001, // 项目名已存在
      });
    } else {
      const project = new Project(req.body);
      const savedProject = await project.save();
      res.status(200).send({
        retcode: 0,
        title: '项目',
        project: savedProject
      });
    }

  } catch (err) {
    next(err);
  }
});


router.get('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const project = await Project.findOne({_id: _id});
    res.status(200).send({
      retcode: 0,
      project: project
    });
  } catch (err) {
    next(err);
  }
});
router.delete('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const project = await Project.findOneAndRemove({_id: _id});
    res.status(200).send({
      retcode: 0,
      project: project
    });
  } catch (err) {
    next(err);
  }
});

router.put('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const project = await Project.findOneAndUpdate({_id: _id}, req.body);
    res.status(200).send({
      retcode: 0,
      project: project
    });
  } catch (err) {
    next(err);
  }
});



export default router;

