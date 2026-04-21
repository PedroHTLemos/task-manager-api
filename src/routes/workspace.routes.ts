import { Router } from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import {
  createWorkspace,
  listWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '../controllers/workspace.controller'
import { Request, Response, NextFunction } from 'express'

const router = Router()

const auth = (req: Request, res: Response, next: NextFunction) =>
  authenticate(req, res, next)

router.use(auth)

router.post('/', (req, res) => createWorkspace(req as AuthRequest, res))
router.get('/', (req, res) => listWorkspaces(req as AuthRequest, res))
router.get('/:workspaceId', (req, res) => getWorkspace(req as AuthRequest, res))

router.put(
  '/:workspaceId',
  requireRole('ADMIN'),
  (req, res) => updateWorkspace(req as AuthRequest, res)
)

router.delete(
  '/:workspaceId',
  requireRole('ADMIN'),
  (req, res) => deleteWorkspace(req as AuthRequest, res)
)

export default router