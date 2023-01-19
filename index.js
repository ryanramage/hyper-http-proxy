const http = require('http')
const HyperDHT = require('@hyperswarm/dht')
const dht = new HyperDHT()

const servicePublicKey = process.argv[2]
const port = process.argv[3] || 8000

const key = Buffer.from(servicePublicKey, 'hex')
const handler = (req, res) => {
  const createSocket = () => dht.connect(key)
  const serverSocket = createSocket()

  serverSocket.on('data', (d) => {
    console.log('d', d)
  })

  serverSocket.pipe(res, (err) => {
    console.log('pipe done', err)
    serverSocket.end()
  })
  serverSocket.on('close', () => console.log('close'))
  serverSocket.on('end', () => console.log('end'))
  serverSocket.on('error', (err) => console.log('error', err))
  serverSocket.on('finish', () => {
    console.log('finish')
    res.end()
    serverSocket.destroy()
  })

  serverSocket.write(`${req.method} ${req.url} HTTP/1.1\r\n`)
  const headers = []
  for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
    const header = `${req.rawHeaders[i]}: ${req.rawHeaders[i+1]}`
    headers.push(header)
  }
  const head = headers.join('\r\n') + '\r\n\r\n'
  serverSocket.write(head)
 
  // serverSocket.end()
  // req.pipe(serverSocket)
}

const server = http.createServer(handler)

server.listen(port, () => {
  console.log('http proxy server listening on port:', port)
  console.log('proxy to: ', servicePublicKey)
})

