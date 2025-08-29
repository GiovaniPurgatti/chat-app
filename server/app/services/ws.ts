import server from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

class Ws {
  public io: Server | null = null
  private hasBooted = false

  public boot() {
    if (this.hasBooted) return
    this.hasBooted = true

    const nodeServer = server.getNodeServer()

    this.io = new Server(nodeServer, {
      cors: { origin: '*' },
    })

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      socket.on('message', (message: any) => {
        // console.log('Message received:', message)
        this.io?.emit('message', message) 
      })

      socket.on('clear_messages', () => {
        // console.log('Clearing messages requested by', socket.id)
        this.io?.emit('clear_messages')
      })

      socket.on('barril', () => {
        // console.log('Clearing messages requested by', socket.id)
        this.io?.emit('barril')
      })

      socket.on('risada', () => {
        // console.log('Clearing messages requested by', socket.id)
        this.io?.emit('risada')
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })
  }
}

const ws = new Ws()
export default ws
