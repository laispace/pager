import { Router } from 'express';
import path from 'path';
import Component from '../models/component';
import { getComponent, getComponents } from '../utils/resources';
import { compileComponent } from '../utils/compile';

const router = new Router();


router.get('/:project/:component', async (req, res, next) => {
  try {
    let component = await getComponent(req.params.project, req.params.component);
    component.fileContent = (await compileComponent(req.params.project, req.params.component)).fileContent.toString();
    res.status(200).send({
      retcode: 0,
      component: component
    });
  } catch (err) {
    next(err);
  }
});

export default router;

