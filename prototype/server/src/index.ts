import { Server, Request, ResponseToolkit } from "@hapi/hapi"

import * as sqlite3 from 'sqlite3'

const init = async () => {
    const server: Server = new Server({
        port: 3000,
        host: 'localhost'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request: Request, h: ResponseToolkit) => {
            var db = new sqlite3.Database("db/prototype.db")
            return 'Hello World!'
        }
    })

    await server.start()
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()
