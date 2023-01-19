const http = require('http')
const HyperDHT = require('@hyperswarm/dht')
const dht = new HyperDHT()

const servicePublicKey = process.argv[2]
const port = process.argv[3] || 8000

const key = Buffer.from(servicePublicKey, 'hex')
const handler = (req, res) => {
  const createSocket = () => dht.connect(key, { reusableSocket: true })
  const serverSocket = createSocket()

  serverSocket.on('data', (d) => {
    res.write(d)
    if (d.length < 65536)  {
      res.end()
      serverSocket.destroy()
    }
  })
  req.on('abort', () => {
    serverSocket.destroy()
  })
  req.on('error', () => {
    serverSocket.destroy()
  })

  const headers = []
  for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
    const header = `${req.rawHeaders[i]}: ${req.rawHeaders[i+1]}`
    headers.push(header)
  }
  const head = `${req.method} ${req.url} HTTP/1.1\r\n` + headers.join('\r\n') + '\r\n\r\n'
  serverSocket.write(head)

  req.on('data', chunk => {
    serverSocket.write(chunk)
  })
}

const server = http.createServer(handler)
server.on('clientError', (err, socket) => {
  if (err.code === 'ECONNRESET' || !socket.writable) {
    return;
  }

  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(port, () => {
  console.log('http proxy server listening on port:', port)
  console.log('proxy to: ', servicePublicKey)
})

