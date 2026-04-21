import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../services/token.service'

export interface AuthRequest extends Request {
  userId: string
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido.' })
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    ;(req as AuthRequest).userId = payload.sub

    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' })
  }
}