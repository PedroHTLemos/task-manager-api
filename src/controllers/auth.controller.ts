import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import prisma from '../prisma/client'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../services/token.service'

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ error: 'Email já cadastrado.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    const accessToken = generateAccessToken(user.id)
    const refreshToken = await generateRefreshToken(user.id)

    return res.status(201).json({ user, accessToken, refreshToken })
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' })
    }

    const accessToken = generateAccessToken(user.id)
    const refreshToken = await generateRefreshToken(user.id)

    return res.json({
      user: { id: user.id, name: user.name, email: user.email },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token obrigatório.' })
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    })

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token inválido ou expirado.' })
    }

    const payload = verifyRefreshToken(refreshToken)

    await prisma.refreshToken.delete({ where: { token: refreshToken } })

    const newAccessToken = generateAccessToken(payload.sub)
    const newRefreshToken = await generateRefreshToken(payload.sub)

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch (error) {
    return res.status(401).json({ error: 'Refresh token inválido.' })
  }
}

export async function logout(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } })
    }

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}