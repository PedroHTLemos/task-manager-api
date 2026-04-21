import { Response } from 'express'
import prisma from '../prisma/client'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function createWorkspace(req: AuthRequest, res: Response) {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome do workspace é obrigatório.' })
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        ownerId: req.userId,
        members: {
          create: {
            userId: req.userId,
            role: 'ADMIN',
          },
        },
      },
      include: { members: true },
    })

    return res.status(201).json(workspace)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function listWorkspaces(req: AuthRequest, res: Response) {
  try {
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: req.userId },
        },
      },
      include: {
        _count: { select: { members: true, tasks: true } },
      },
    })

    return res.json(workspaces)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function getWorkspace(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
    })

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace não encontrado.' })
    }

    return res.json(workspace)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function updateWorkspace(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Nome é obrigatório.' })
    }

    const workspace = await prisma.workspace.update({
      where: { id: workspaceId },
      data: { name },
    })

    return res.json(workspace)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function deleteWorkspace(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params

    await prisma.workspace.delete({ where: { id: workspaceId } })

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}