import { Router, Response } from 'express'
import { register, login, refresh, logout } from '../controllers/auth.controller'
import { authenticate, AuthRequest } from '../middlewares/auth.middleware'
import prisma from '../prisma/client'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

router.get('/me', authenticate, async (req, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: (req as AuthRequest).userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })
  res.json(user)
})

export default router