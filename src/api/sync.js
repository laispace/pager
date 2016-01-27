import { Router } from 'express';
import http from '../core/HttpClient';
import {jsonServerUrl} from '../config';
import { getTemplates, getComponents } from '../utils/resources';
const router = new Router();

/**
 * 获取本地文件夹中的组件
 */
router.get('/components', async (req, res, next) => {
  try {
    const components = await getComponents();
    res.status(200).send({
      retcode: 0,
      title: '本地组件列表',
      components: components
    });
  } catch (err) {
    next(err);
  }
});


export default router;

