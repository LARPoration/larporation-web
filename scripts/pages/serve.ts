// Local static-export verification only; Cloudflare remains the production host.
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, resolve, sep } from 'node:path'

const root = resolve('out')
const port = Number(process.argv[2] ?? 3100)
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw new Error('Invalid port')
if (
  !existsSync(resolve(root, '_headers')) ||
  existsSync(resolve(root, '_archive'))
)
  throw new Error('Run build:pages before serving the live export')
const types: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
}
const redirects = readFileSync(resolve(root, '_redirects'), 'utf8')
  .trim()
  .split(/\r?\n/)
  .map((line) => line.trim().split(/\s+/))
createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method ?? '')) {
    response.writeHead(405).end()
    return
  }
  try {
    const url = new URL(request.url ?? '/', 'http://localhost')
    const pathname = decodeURIComponent(url.pathname)
    const redirect = redirects.find(([source]) => source === pathname)
    if (redirect) {
      response
        .writeHead(Number(redirect[2]), { Location: redirect[1] + url.search })
        .end()
      return
    }
    if (pathname.includes('\\') || pathname.includes('\0'))
      throw new Error('Unsafe path')
    const file = resolve(root, '.' + pathname)
    if (file !== root && !file.startsWith(root + sep))
      throw new Error('Unsafe path')
    const candidates = [file, file + '.html', resolve(file, 'index.html')]
    const found = candidates.find(
      (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
    )
    const target = found ?? resolve(root, '404.html')
    response.writeHead(found ? 200 : 404, {
      'Content-Type': types[extname(target)] ?? 'application/octet-stream',
    })
    response.end(request.method === 'HEAD' ? undefined : readFileSync(target))
  } catch {
    response.writeHead(404).end()
  }
}).listen(port, '127.0.0.1', () =>
  console.log(`Local Pages export: http://127.0.0.1:${port}`),
)
