import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import workspaceRoutes from './routes/workspace.routes'
import memberRoutes from './routes/member.routes'
import taskRoutes from './routes/task.routes'

const app = express()

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    /\.vercel\.app$/,
  ],
  credentials: true,
}))

app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))
app.use('/auth', authRoutes)
app.use('/workspaces', workspaceRoutes)
app.use('/workspaces/:workspaceId/members', memberRoutes)
app.use('/workspaces/:workspaceId/tasks', taskRoutes)

export default app
