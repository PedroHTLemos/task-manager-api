import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed...')

  // Limpa dados existentes do demo
  await prisma.refreshToken.deleteMany({})
  await prisma.task.deleteMany({})
  await prisma.member.deleteMany({})
  await prisma.workspace.deleteMany({})
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          'demo@taskmanager.com',
          'ana@taskmanager.com',
          'carlos@taskmanager.com',
        ],
      },
    },
  })

  // Cria usuários
  const passwordHash = await bcrypt.hash('demo1234', 10)

  const demo = await prisma.user.create({
    data: {
      name: 'Conta Demo',
      email: 'demo@taskmanager.com',
      passwordHash,
    },
  })

  const ana = await prisma.user.create({
    data: {
      name: 'Ana Silva',
      email: 'ana@taskmanager.com',
      passwordHash,
    },
  })

  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos Mendes',
      email: 'carlos@taskmanager.com',
      passwordHash,
    },
  })

  console.log('✅ Usuários criados')

  // Cria workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Projeto Portfólio',
      ownerId: demo.id,
      members: {
        create: [
          { userId: demo.id, role: 'ADMIN' },
          { userId: ana.id, role: 'MEMBER' },
          { userId: carlos.id, role: 'MEMBER' },
        ],
      },
    },
  })

  console.log('✅ Workspace criado')

  // Cria tarefas
  await prisma.task.createMany({
    data: [
      {
        title: 'Definir paleta de cores',
        description: 'Escolher as cores principais do design system',
        status: 'DONE',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: ana.id,
      },
      {
        title: 'Criar wireframes das telas',
        description: 'Prototipar as telas de login, dashboard e perfil',
        status: 'DONE',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: ana.id,
      },
      {
        title: 'Implementar autenticação JWT',
        description: 'Login, cadastro, refresh token e rotas protegidas',
        status: 'DONE',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: demo.id,
      },
      {
        title: 'Desenvolver API de tarefas',
        description: 'CRUD completo com regras de permissão por role',
        status: 'IN_PROGRESS',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: demo.id,
      },
      {
        title: 'Integrar drag and drop no Kanban',
        description: 'Arrastar tarefas entre colunas e persistir no backend',
        status: 'IN_PROGRESS',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: carlos.id,
      },
      {
        title: 'Escrever testes de integração',
        description: 'Cobrir as rotas principais com Jest e Supertest',
        status: 'TODO',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: carlos.id,
      },
      {
        title: 'Configurar CI/CD no GitHub Actions',
        description: 'Pipeline de build, testes e deploy automático',
        status: 'TODO',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: null,
      },
      {
        title: 'Fazer deploy em produção',
        description: 'Backend no Railway e frontend no Vercel',
        status: 'TODO',
        workspaceId: workspace.id,
        creatorId: demo.id,
        assigneeId: demo.id,
      },
    ],
  })

  console.log('✅ Tarefas criadas')
  console.log('')
  console.log('🎉 Seed concluído!')
  console.log('')
  console.log('Credenciais de demonstração:')
  console.log('  Email:  demo@taskmanager.com')
  console.log('  Senha:  demo1234')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
