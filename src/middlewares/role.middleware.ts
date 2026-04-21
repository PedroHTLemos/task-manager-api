import { Response, NextFunction } from 'express'
import prisma from '../prisma/client'
import { AuthRequest } from './auth.middleware'

export function requireRole(...roles: ('ADMIN' | 'MEMBER')[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { workspaceId } = req.params

      if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId obrigatório.' })
      }

      const member = await prisma.member.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.userId,
            workspaceId,
          },
        },
      })

      if (!member) {
        return res.status(403).json({ error: 'Você não é membro deste workspace.' })
      }

      if (!roles.includes(member.role)) {
        return res.status(403).json({ error: 'Permissão insuficiente.' })
      }

      return next()
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor.' })
    }
  }
}