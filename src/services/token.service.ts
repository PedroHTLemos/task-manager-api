import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'

const ACCESS_TOKEN_EXPIRY = '15m'
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000 

export function generateAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })
}

export async function generateRefreshToken(userId: string) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  })

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    },
  })

  return token
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET) as { sub: string }
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { sub: string }
}