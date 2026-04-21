import { Response } from 'express'
import prisma from '../prisma/client'
import { AuthRequest } from '../middlewares/auth.middleware'

export async function createTask(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params
    const { title, description, assigneeId } = req.body

    if (!title) {
      return res.status(400).json({ error: 'Título é obrigatório.' })
    }

    if (assigneeId) {
      const isMember = await prisma.member.findUnique({
        where: {
          userId_workspaceId: { userId: assigneeId, workspaceId },
        },
      })
      if (!isMember) {
        return res.status(400).json({ error: 'Responsável não é membro deste workspace.' })
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        workspaceId,
        creatorId: req.userId,
        assigneeId: assigneeId ?? null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    })

    return res.status(201).json(task)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function listTasks(req: AuthRequest, res: Response) {
  try {
    const { workspaceId } = req.params
    const { status, assigneeId } = req.query

    const tasks = await prisma.task.findMany({
      where: {
        workspaceId,
        ...(status && { status: status as any }),
        ...(assigneeId && { assigneeId: assigneeId as string }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return res.json(tasks)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function getTask(req: AuthRequest, res: Response) {
  try {
    const { workspaceId, taskId } = req.params

    const task = await prisma.task.findFirst({
      where: { id: taskId, workspaceId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    })

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' })
    }

    return res.json(task)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const { workspaceId, taskId } = req.params
    const { title, description, status, assigneeId } = req.body

    const task = await prisma.task.findFirst({
      where: { id: taskId, workspaceId },
    })

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' })
    }

    const member = await prisma.member.findUnique({
      where: {
        userId_workspaceId: { userId: req.userId, workspaceId },
      },
    })

    if (member?.role === 'MEMBER' && task.assigneeId !== req.userId) {
      return res.status(403).json({ error: 'Você só pode editar tarefas atribuídas a você.' })
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true, email: true } },
      },
    })

    return res.json(updated)
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const { workspaceId, taskId } = req.params

    const task = await prisma.task.findFirst({
      where: { id: taskId, workspaceId },
    })

    if (!task) {
      return res.status(404).json({ error: 'Tarefa não encontrada.' })
    }

    await prisma.task.delete({ where: { id: taskId } })

    return res.status(204).send()
  } catch (error) {
    return res.status(500).json({ error: 'Erro interno do servidor.' })
  }
}