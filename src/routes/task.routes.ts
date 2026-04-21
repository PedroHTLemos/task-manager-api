import { Router, Request, Response, NextFunction } from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/task.controller'

const router = Router({ mergeParams: true })

const auth = (req: Request, res: Response, next: NextFunction) =>
  authenticate(req, res, next)

router.use(auth)
router.get('/', (req, res) => listTasks(req as AuthRequest, res))
router.get('/:taskId', (req, res) => getTask(req as AuthRequest, res))
router.post('/', (req, res) => createTask(req as AuthRequest, res))
router.patch('/:taskId', (req, res) => updateTask(req as AuthRequest, res))
router.delete('/:taskId', requireRole('ADMIN'), (req, res) =>
  deleteTask(req as AuthRequest, res)
)

export default router