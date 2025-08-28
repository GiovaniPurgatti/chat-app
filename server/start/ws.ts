import ws from '#services/ws'
import app from '@adonisjs/core/services/app'

app.ready(() => {
  ws.boot()
})
