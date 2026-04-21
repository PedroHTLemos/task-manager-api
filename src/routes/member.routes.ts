import { Router, Request, Response, NextFunction } from 'express'
import { authenticate, AuthRequest } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import {
  inviteMember,
  listMembers,
  updateMemberRole,
  removeMember,
} from '../controllers/member.controller'

const router = Router({ mergeParams: true })

const auth = (req: Request, res: Response, next: NextFunction) =>
  authenticate(req, res, next)

router.use(auth)

router.get('/', (req, res) => listMembers(req as AuthRequest, res))

router.post(
  '/',
  requireRole('ADMIN'),
  (req, res) => inviteMember(req as AuthRequest, res)
)

router.patch(
  '/:memberId/role',
  requireRole('ADMIN'),
  (req, res) => updateMemberRole(req as AuthRequest, res)
)

router.delete(
  '/:memberId',
  requireRole('ADMIN'),
  (req, res) => removeMember(req as AuthRequest, res)
)

export default router