import { file } from 'bun'
import path from 'node:path'

const PORT = process.env.PORT || 8500
const DIST_DIR = path.join(import.meta.dir, 'dist')

// Valid SPA routes that should serve index.html
const SPA_ROUTES = [
  // Root and auth routes
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',

  // Public routes
  '/book-demo',
  '/case-studies',
  '/contact-us',
  '/about',
  '/articles',
  '/contact',
  '/solutions',

  // Dashboard routes
  '/dashboard',
  '/dashboard/users',
  '/dashboard/organizations',
  '/dashboard/data',
  '/dashboard/assessments',
  '/dashboard/profile',

  // Admin routes
  '/dashboard/admin/create-user',
  '/dashboard/admin/create-user-batch',
  '/dashboard/admin/create-organization',

  // Quiz routes
  '/quiz'
]

// Route patterns that should be validated dynamically
const DYNAMIC_ROUTE_PATTERNS = [
  /^\/articles\/[^\/]+$/, // /articles/:slug
  /^\/services\/[^\/]+$/, // /services/:slug
  /^\/dashboard\/[^\/]+\/services$/, // /dashboard/:id/services
  /^\/dashboard\/admin\/organization\/[^\/]+\/update$/, // /dashboard/admin/organization/:id/update
  /^\/dashboard\/admin\/organization\/[^\/]+\/details$/, // /dashboard/admin/organization/:id/details
  /^\/dashboard\/admin\/users\/[^\/]+\/profile$/, // /dashboard/admin/users/:id/profile
  /^\/quiz\/[^\/]+$/, // /quiz/:id
  /^\/quiz\/[^\/]+\/results$/ // /quiz/:id/results
]

function isValidSPARoute(pathname: string): boolean {
  // Check exact matches
  if (SPA_ROUTES.includes(pathname)) {
    return true
  }

  // Check dynamic route patterns
  return DYNAMIC_ROUTE_PATTERNS.some(pattern => pattern.test(pathname))
}

async function serveStatic(pathname: string): Promise<Response | null> {
  const filePath = path.join(DIST_DIR, pathname === '/' ? 'index.html' : pathname)

  try {
    const fileObj = file(filePath)

    if (await fileObj.exists()) {
      const ext = path.extname(filePath).toLowerCase()

      const mimeTypes: Record<string, string> = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.json': 'application/json',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
      }

      const contentType = mimeTypes[ext] || 'application/octet-stream'

      return new Response(fileObj, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000'
        }
      })
    }
  } catch (error) {
    console.error('Error serving file:', error)
  }

  return null
}

const server = Bun.serve({
  port: PORT,
  hostname: '0.0.0.0', // Bind to all interfaces for Docker
  async fetch(req) {
    const url = new URL(req.url)
    const pathname = url.pathname

    console.log(`${req.method} ${pathname}`)

    // Try to serve static file first
    const staticResponse = await serveStatic(pathname)
    if (staticResponse) {
      return staticResponse
    }

    // For GET requests, check if it's a valid SPA route
    if (req.method === 'GET') {
      if (isValidSPARoute(pathname)) {
        // Valid SPA route - serve index.html
        const indexResponse = await serveStatic('/')
        if (indexResponse) {
          return indexResponse
        }
      } else {
        // Invalid route - return hard 404
        console.log(`❌ Hard 404 for invalid route: ${pathname}`)
        return new Response('<!DOCTYPE html><html><head><title>404 Not Found</title><style>body{font-family:Arial,sans-serif;text-align:center;padding:50px;background:#f5f5f5}h1{color:#e74c3c;font-size:48px;margin:0}p{font-size:18px;color:#666;margin:20px 0}a{color:#3498db;text-decoration:none}a:hover{text-decoration:underline}</style></head><body><h1>404</h1><p>The page you are looking for does not exist.</p><p><a href="/">Go back to homepage</a></p></body></html>', {
          status: 404,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        })
      }
    }

    // 404 for non-GET requests
    return new Response('Not Found', { status: 404 })
  },
  error(error) {
    console.error('Server error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
})

console.log(`🚀 Production server running at http://localhost:${server.port}`)
console.log(`📁 Serving files from: ${DIST_DIR}`)