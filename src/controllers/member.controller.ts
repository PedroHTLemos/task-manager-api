import { Response } from 'express'
import prisma from '../prisma/client'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function inviteMember(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params
    const { email, role } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório.' })
    }

    const userToInvite = await prisma.user.findUnique({ where: { email } })
    if (!userToInvite) {
      return res.status(404).json({ error: 'Usuário não encontrado.' })
    }

    const alreadyMember = await prisma.member.findUnique({
      where: {
        userId_workspaceId: {
          userId: userToInvite.id,
          workspaceId,
        },
      },
    })

    if (alreadyMember) {
      return res.status(409).json({ error: 'Usuário já é membro deste workspace.' })
    }

    const member = await prisma.member.create({
      data: {
        userId: userToInvite.id,
        workspaceId,
        role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER',
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return res.status(201).json(member)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function listMembers(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params

    const members = await prisma.member.findMany({
      where: { workspaceId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return res.json(members)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function updateMemberRole(req: AuthRequest, res: Response) {
  try {
    const { workspaceId, memberId } = req.params
    const { role } = req.body

    if (!role || !['ADMIN', 'MEMBER'].includes(role)) {
      return res.status(400).json({ error: 'Role inválida. Use ADMIN ou MEMBER.' })
    }

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    })

    if (!member || member.workspaceId !== workspaceId) {
      return res.status(404).json({ error: 'Membro não encontrado.' })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (workspace?.ownerId === member.userId) {
      return res.status(403).json({ error: 'Não é possível alterar o role do dono do workspace.' })
    }

    const updated = await prisma.member.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })

    return res.json(updated)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function removeMember(req: AuthRequest, res: Response) {
  try {
    const { workspaceId, memberId } = req.params

    const member = await prisma.member.findUnique({
      where: { id: memberId },
    })

    if (!member || member.workspaceId !== workspaceId) {
      return res.status(404).json({ error: 'Membro não encontrado.' })
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    })

    if (workspace?.ownerId === member.userId) {
      return res.status(403).json({ error: 'Não é possível remover o dono do workspace.' })
    }

    await prisma.member.delete({ where: { id: memberId } })

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}