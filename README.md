<h1 align="center" style="font-weight: bold;">Rodrigo Alflen Fotografia 📸</h1>

<p align="center">
  <a href="#-english">English</a> •
  <a href="#-português">Português</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL on Neon" />
  <img src="https://img.shields.io/badge/Cloudflare-R2-F38020?logo=cloudflare&logoColor=white" alt="Cloudflare R2" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <a href="https://rodrigoalflen.vercel.app"><b>🔗 Live site</b></a>
</p>

<!-- ======================================================= -->
<!-- ENGLISH                                                   -->
<!-- ======================================================= -->

<h5 id="-english">🇺🇸 English</h5>

<p align="center">
<a href="#tech-en">Technologies</a> •
<a href="#features-en">Features</a> •
<a href="#security-en">Security</a> •
<a href="#architecture-en">Architecture</a> •
<a href="#started-en">Getting Started</a> •
<a href="#routes-en">Routes</a> •
<a href="#deploy-en">Deploy</a> •
<a href="#roadmap-en">Roadmap</a> •
<a href="#author-en">Author</a>
</p>

<p align="center">
<b>A full-stack website for a wedding photographer: a high-conversion landing page plus a private client area where couples view, download and share their photo galleries, managed through an admin panel.</b>
</p>

<p align="center">
<i>Built for a real client (Rodrigo Alflen Fotografia, Paraná, Brazil), this project replaces a legacy site whose source code was no longer accessible. It has two goals: a pixel-faithful, fast and responsive landing page that turns visitors into budget requests, and a secure delivery system that replaces third-party gallery links with the photographer's own branded experience, from login and password recovery by e-mail to full-resolution downloads and private view-only links for family members.</i>
</p>

<h2 id="preview-en">🖼️ Preview</h2>

<p align="center">
  <img src="docs/screenshots/home.png" alt="Landing page" width="48%" />
  <img src="docs/screenshots/client-area.png" alt="Client area login" width="48%" />
</p>
<p align="center">
  <img src="docs/screenshots/gallery.png" alt="Client gallery with lightbox" width="48%" />
  <img src="docs/screenshots/admin.png" alt="Admin panel" width="48%" />
</p>

<h2 id="tech-en">💻 Technologies</h2>

| Layer            | Technology                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, Server Components, Server Actions, Cache Components)                                                  |
| UI               | React 19, TypeScript 5, plain CSS with design tokens (no UI framework), `next/font` (Cormorant Garamond, Jost, Pinyon Script) |
| Database         | PostgreSQL on Neon (pooled connection), Drizzle ORM, `postgres.js`                                                            |
| File storage     | Cloudflare R2 (S3 API), private bucket, presigned uploads                                                                     |
| Image processing | `sharp` (resize, WebP, EXIF stripping)                                                                                        |
| Authentication   | Custom: `bcryptjs`, opaque session tokens, `httpOnly` cookies                                                                 |
| E-mail           | Resend (transactional e-mail for password recovery)                                                                           |
| Tooling          | ESLint, Jest, `tsx`, `drizzle-kit`                                                                                            |
| Hosting          | Vercel                                                                                                                        |

<h2 id="features-en">🧾 Key Features</h2>

<h3>Public website</h3>

- **Pixel-faithful landing page** rebuilt from a legacy site: hero with photo slideshow, awards marquee, manifesto, services, filterable portfolio, about, process, video testimonials, FAQ, contact form, and footer.
- **Motion with purpose:** count-up statistics (runs once), cross-fading hero photos, infinite marquee, smooth anchor scrolling with a custom easing, and a rotating circular badge.
- **Mobile-first behavior, not just resizing:** services become a swipeable tab picker, the process section becomes a snap carousel with a progress bar, and the portfolio shows 6 photos with a "Load more" button.
- **Self-hosted media:** the testimonial video is a local file that only downloads after the visitor presses play (`preload="none"`), so it does not affect page speed.
- **Link-in-bio page (`/wp`)** with budget shortcuts that open WhatsApp with pre-filled messages.
- **Legal pages** (Privacy Policy and Terms of Use) written for Brazilian law (LGPD) with a sticky table of contents.
- **SEO:** structured data (JSON-LD), Open Graph, canonical URLs, `robots.txt`, and `noindex` on every private route.

<h3>Client area</h3>

- **Numeric login and password** generated by the admin, with an anti-guessing policy.
- **Password recovery by e-mail** with one-time links that expire in 1 hour.
- **Gallery list** with cover, event date, photo count and days remaining.
- **Justified photo grid** (portrait and landscape side by side) and a **fullscreen lightbox** with keyboard, swipe, preloading and focus trapping.
- **Downloads:** single original photo or the whole gallery as a **ZIP generated on the fly** and split into parts (up to 350 MB or 200 photos each) to fit serverless time limits.
- **Private share links:** the client creates a link for relatives to view the photos **without logging in, without downloading and without access to the original files**. Links have an expiry (7, 30, 90 days or the gallery's own expiry), a view counter, and can be revoked at any time.
- **Per-gallery rules:** expiry date (default 365 days) and a switch to allow or block downloads.

<h3>Admin panel</h3>

- **Client management:** create accounts with auto-generated login and password (shown once, with copy and WhatsApp-message buttons), edit data, reset password, deactivate access, delete.
- **Gallery management:** create galleries, set expiry and download permission.
- **Direct-to-storage upload:** photos go from the browser straight to R2 (3 in parallel, with progress), bypassing serverless body limits. The server then validates each file and generates a 2000 px preview and a 640 px thumbnail (WebP, **no EXIF/GPS**).
- **Photo organization:** choose a cover, move photos to the start, sort by filename (natural order), bulk delete (files are removed from storage too).

<h2 id="security-en">🔐 Security</h2>

Security was treated as a feature, not an afterthought. Photos of weddings and families are private data.

| Concern           | Approach                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Passwords         | `bcrypt` (12 rounds), never stored or logged in plain text; passwords shown only once at creation                                                                                                                  |
| Sessions          | Random 256-bit token in an `httpOnly`, `secure`, `SameSite=Lax` cookie (`__Host-` prefix in production); only the **SHA-256 hash** is stored; client 30 days, admin 8 hours; sessions are wiped on password change |
| Brute force       | Per-IP rate limits and a 15-minute account lock after 5 failures, backed by an **atomic Postgres upsert** (works on serverless, no Redis needed)                                                                   |
| User enumeration  | Identical responses and timing for unknown login vs. wrong password (dummy hash comparison); password-recovery answers the same way whether the e-mail exists or not, and does its work in `after()`               |
| Password recovery | Tokens hashed in the database, 1 hour expiry, single use consumed in a transaction, previous tokens invalidated, limits per e-mail and per IP                                                                      |
| Authorization     | Every admin page, Server Action and API route re-checks the role (layouts alone do not protect client-side navigations); every photo request is checked against owner, expiry and download permission              |
| Private storage   | Bucket has no public access; files are only streamed through authenticated routes; originals are never served on screen routes or share links                                                                      |
| Share links       | 256-bit tokens (hash only in the database, shown once), revocable, expiring, limited to 10 active per gallery; they only expose resized, EXIF-free images                                                          |
| Uploads           | Presigned URLs are scoped to a single key and content type; files are re-validated with `sharp` (format, pixel limit, size); object keys must belong to the target gallery                                         |
| CSRF              | Same-origin check on all state-changing API routes; Server Actions use Next.js built-in protection                                                                                                                 |
| HTTP hardening    | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false`, `noindex` on private areas                                                                       |
| Timing attacks    | Constant-time comparisons (`timingSafeEqual`) where secrets are compared                                                                                                                                           |

<h2 id="architecture-en">🏗️ Architecture</h2>

<h3>Project structure</h3>

```text
├── public/                      # Static assets (logo, portfolio, testimonials)
├── scripts/                     # Operational scripts
│   ├── create-user.ts           # Creates an admin/client account from the terminal
│   ├── check-env.ts             # Pre-deploy environment validation
│   ├── audit-storage.ts         # Compares the R2 bucket with the database
│   └── optimize-images.mjs      # Image optimization pipeline
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── wp/                  # Link-in-bio page
│   │   ├── cliente/             # Client login, galleries, password recovery
│   │   ├── ver/[token]/         # Public view-only share page
│   │   ├── admin/               # Admin panel (login + protected area)
│   │   ├── politica-de-privacidade/ and termos-de-uso/
│   │   └── api/                 # Route Handlers (auth, photos, ZIP, uploads)
│   ├── components/              # Sections, client area, admin, legal, UI primitives
│   ├── db/                      # Drizzle schema and connection
│   └── lib/                     # auth/, security/, storage/, email/, gallery/, admin/
└── drizzle.config.ts
```

<h3>Data model</h3>

```mermaid
erDiagram
    USERS ||--o{ GALLERIES : owns
    USERS ||--o{ SESSIONS : has
    USERS ||--o{ PASSWORD_RESETS : requests
    USERS ||--o{ SHARE_LINKS : creates
    GALLERIES ||--o{ PHOTOS : contains
    GALLERIES ||--o{ SHARE_LINKS : exposes
    USERS {
        uuid id PK
        enum role
        text login
        text email
        text password_hash
        boolean active
        timestamptz locked_until
    }
    GALLERIES {
        uuid id PK
        uuid user_id FK
        text title
        date event_date
        timestamptz expires_at
        boolean allow_download
    }
    PHOTOS {
        uuid id PK
        uuid gallery_id FK
        text original_key
        text preview_key
        text thumb_key
        int position
    }
    SHARE_LINKS {
        uuid id PK
        uuid gallery_id FK
        text token_hash
        timestamptz expires_at
        timestamptz revoked_at
        int view_count
    }
    SESSIONS {
        uuid id PK
        uuid user_id FK
        text token_hash
        timestamptz expires_at
    }
    PASSWORD_RESETS {
        uuid id PK
        uuid user_id FK
        text token_hash
        timestamptz used_at
    }
    RATE_LIMITS {
        text key PK
        int count
        timestamptz reset_at
    }
```

<h3>Photo upload pipeline</h3>

```mermaid
sequenceDiagram
    autonumber
    participant A as Admin (browser)
    participant API as Next.js API
    participant R2 as Cloudflare R2
    participant DB as Neon Postgres
    A->>API: POST /fotos/sign (type and size)
    API-->>A: presigned PUT URL (10 min)
    A->>R2: PUT original (direct upload)
    A->>API: POST /fotos/process (object key)
    API->>R2: read original
    API->>API: sharp resizes to preview 2000px and thumb 640px (WebP, no EXIF)
    API->>R2: write preview and thumb
    API->>DB: insert photo record
    API-->>A: photo id
```

<h3>Design system</h3>

| Token          | Value     | Use                                  |
| -------------- | --------- | ------------------------------------ |
| `--brown`      | `#3e2a1f` | Primary text, buttons, dark sections |
| `--accent`     | `#a8825d` | Highlights, links, icons             |
| `--cream`      | `#f1e8df` | Alternate sections                   |
| `--cream-soft` | `#faf6f1` | Cards and soft backgrounds           |

Typography pairs **Cormorant Garamond** (headings), **Jost** (body) and **Pinyon Script** (signature accents), all loaded through `next/font`.

<h2 id="started-en">🚀 Getting started</h2>

<h3>Prerequisites</h3>

- Node.js 20.9 or higher
- Git
- A [Neon](https://neon.tech) PostgreSQL project (free tier works)
- A [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket (private)
- A [Resend](https://resend.com) account (optional in development: without an API key, e-mails are printed in the terminal)

<h3>Cloning</h3>

```bash
git clone https://github.com/jglucian0/rodrigoalflen-lp
cd rodrigoalflen-lp
npm install
```

<h3>Config .env variables</h3>

Copy `.env.example` to `.env.local` and fill in the values:

```yaml
DATABASE_URL="postgres://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
APP_URL="http://localhost:3000"
RESEND_API_KEY=""
EMAIL_FROM="Rodrigo Alflen Fotografia <onboarding@resend.dev>"
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
```

| Variable         | Description                                                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`   | Neon connection string. Use the **direct** host locally and the **pooled** host (`-pooler`) in production. Do **not** include `channel_binding=require` |
| `APP_URL`        | Public site URL, used to build e-mail links. `https://` and no trailing slash in production                                                             |
| `RESEND_API_KEY` | Resend API key. Empty in development prints e-mails to the terminal                                                                                     |
| `EMAIL_FROM`     | Sender. Needs a verified domain in production                                                                                                           |
| `R2_*`           | Cloudflare R2 credentials and bucket name. Use a **separate bucket** for development                                                                    |

<h3>Database and first admin</h3>

```bash
npm run db:push                                   # creates the tables
npm run user:create -- admin "Your Name" you@mail.com    # prints a generated password (shown once)
npm run db:studio                                 # optional: visual database browser
```

<h3>Cloudflare R2 setup</h3>

1. Create a bucket **without public access**.
2. Create an API token with **Object Read & Write**, restricted to that bucket.
3. Add this CORS policy so the browser can upload directly (add your production domain too, without a trailing slash):

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://your-domain.com"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

<h3>Starting</h3>

```bash
npm run dev       # development server at http://localhost:3000
npm run build     # production build
npm start         # serves the production build
```

<h3>Scripts</h3>

| Script                                                | Description                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `npm run dev` / `build` / `start`                     | Standard Next.js workflow                                                                        |
| `npm run lint` / `npm test`                           | ESLint and Jest                                                                                  |
| `npm run db:push`                                     | Syncs the Drizzle schema with the database                                                       |
| `npm run db:studio`                                   | Opens Drizzle Studio                                                                             |
| `npm run user:create -- <admin\|client> "Name" email` | Creates an account with generated credentials                                                    |
| `npm run check:env`                                   | Validates environment variables before deploying                                                 |
| `npm run storage:audit`                               | Compares the bucket with the database (read-only; `-- --delete` removes orphans older than 24 h) |
| `npm run optimize:images`                             | Optimizes images in `public/`                                                                    |

<h2 id="routes-en">📍 Routes</h2>

<h3>Pages</h3>

| route                                                               | description                                                  |
| ------------------------------------------------------------------- | ------------------------------------------------------------ |
| <kbd>/</kbd>                                                        | Landing page                                                 |
| <kbd>/wp</kbd>                                                      | Link-in-bio page with budget shortcuts                       |
| <kbd>/cliente</kbd>                                                 | Client login (redirects to galleries when already signed in) |
| <kbd>/cliente/galeria</kbd>                                         | List of the client's galleries (auth required)               |
| <kbd>/cliente/galeria/[id]</kbd>                                    | Gallery: grid, lightbox, downloads and share links           |
| <kbd>/cliente/recuperar-senha</kbd>                                 | Request a password recovery e-mail                           |
| <kbd>/cliente/redefinir-senha?token=…</kbd>                         | Set a new password from an e-mail link                       |
| <kbd>/ver/[token]</kbd>                                             | Public view-only gallery (no login, no download)             |
| <kbd>/admin/entrar</kbd>                                            | Admin login                                                  |
| <kbd>/admin</kbd>                                                   | Admin: client list (admin required)                          |
| <kbd>/admin/clientes/novo</kbd> and <kbd>/admin/clientes/[id]</kbd> | Create and manage clients and their galleries                |
| <kbd>/admin/galerias/[id]</kbd>                                     | Gallery settings, photo upload and organization              |
| <kbd>/politica-de-privacidade</kbd> and <kbd>/termos-de-uso</kbd>   | Legal pages                                                  |

<h3>API endpoints</h3>

| route                                                  | description                                                                                    |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| <kbd>POST /api/cliente/login</kbd>                     | Validates numeric login and password, opens a session. [details](#post-login-en)               |
| <kbd>POST /api/cliente/logout</kbd>                    | Ends the current session.                                                                      |
| <kbd>POST /api/cliente/recuperar-senha</kbd>           | Sends a recovery e-mail. Always answers the same way.                                          |
| <kbd>POST /api/cliente/redefinir-senha</kbd>           | Consumes a recovery token and sets a new password.                                             |
| <kbd>GET /api/cliente/fotos/:photoId/:variant</kbd>    | Streams `thumb`, `preview` or `download` (original) after owner, expiry and permission checks. |
| <kbd>GET /api/cliente/galerias/:id/zip?part=N</kbd>    | Streams a ZIP part of the gallery (generated on the fly).                                      |
| <kbd>GET /api/ver/:token/fotos/:photoId/:variant</kbd> | Streams `thumb` or `preview` for a valid share link. Never the original.                       |
| <kbd>POST /api/admin/login</kbd>                       | Admin login by e-mail and password.                                                            |
| <kbd>POST /api/admin/galerias/:id/fotos/sign</kbd>     | Authorizes one upload and returns a presigned URL. [details](#post-upload-en)                  |
| <kbd>POST /api/admin/galerias/:id/fotos/process</kbd>  | Validates the uploaded file, generates preview and thumbnail, registers the photo.             |
| <kbd>GET /api/admin/fotos/:photoId/:variant</kbd>      | Admin-only access to `thumb` and `preview`.                                                    |

<h3 id="post-login-en">POST /api/cliente/login</h3>

**_REQUEST BODY_**

```json
{
  "login": "48213907",
  "password": "73918264"
}
```

**_RESPONSE_**

```json
{
  "redirect": "/cliente/galeria"
}
```

**_ERROR (same body for unknown login and wrong password)_**

```json
{
  "error": "Login ou senha incorretos."
}
```

<h3 id="post-upload-en">Upload: sign and process</h3>

**_POST /api/admin/galerias/:id/fotos/sign_**

```json
{
  "filename": "IMG_0421.jpg",
  "contentType": "image/jpeg",
  "size": 8421937
}
```

```json
{
  "key": "galleries/9b2f…/orig/3c1e….jpg",
  "uploadUrl": "https://<bucket>.<account>.r2.cloudflarestorage.com/…"
}
```

The browser then `PUT`s the file straight to `uploadUrl` and calls **POST /api/admin/galerias/:id/fotos/process** with `{ "key", "filename" }`.

<h2 id="deploy-en">☁️ Deploy (Vercel)</h2>

1. Import the repository on Vercel.
2. Add the environment variables to **Production** (mark secrets as _Sensitive_). `R2_ACCOUNT_ID` must also be available at **build** time because the Content Security Policy allows the R2 upload host.
3. Use the **pooled** Neon connection string, without `channel_binding`.
4. Add the production domain to the bucket's **CORS** policy (exact origin, no trailing slash).
5. Verify the domain in Resend (SPF, DKIM, DMARC) before sending real e-mails.
6. Run `npm run check:env` against the production values before the first deploy.
7. Redeploy after changing variables (they only apply to new deployments).

Use a **separate Neon branch and a separate R2 bucket** for development so test data and `storage:audit --delete` can never touch production.

<h2 id="roadmap-en">🗺️ Roadmap</h2>

- [ ] Two-factor authentication for the admin account
- [ ] Admin view to list and revoke clients' share links
- [ ] Automatic cleanup of expired galleries and an e-mail warning before expiry
- [ ] Automated backups (database dump and object storage sync via GitHub Actions)
- [ ] Error monitoring (Sentry)
- [ ] Automated tests for the security-critical flows (login, recovery, share links)

<h2 id="author-en">🤝 Author</h2>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/jglucian0">
        <img src="https://avatars.githubusercontent.com/u/169113323?v=4" width="100px;" alt="João Gabriel Luciano Profile Picture"/><br>
        <sub>
          <b>João Gabriel Luciano</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

Built for **Rodrigo Alflen Fotografia**.

<h2 id="contribute-en">📫 Contribute</h2>

1. `git checkout -b feature/your-feature`
2. Follow commit patterns (Conventional Commits).
3. Make sure `npm run lint` and `npm run build` pass.
4. Open a Pull Request detailing the changes.

<h2 id="license-en">📄 License</h2>

The source code is available for portfolio and review purposes. Photos, brand, logo and copy belong to **Rodrigo Alflen Fotografia** and may not be reused.

---

<!-- ======================================================= -->
<!-- PORTUGUÊS                                                 -->
<!-- ======================================================= -->

<h5 id="-português">🇧🇷 Português</h5>

<p align="center">
<a href="#tech-pt">Tecnologias</a> •
<a href="#features-pt">Funcionalidades</a> •
<a href="#security-pt">Segurança</a> •
<a href="#architecture-pt">Arquitetura</a> •
<a href="#started-pt">Primeiros Passos</a> •
<a href="#routes-pt">Rotas</a> •
<a href="#deploy-pt">Deploy</a> •
<a href="#roadmap-pt">Roadmap</a> •
<a href="#author-pt">Autor</a>
</p>

<p align="center">
<b>Site completo para um fotógrafo de casamentos: uma landing page focada em conversão e uma área do cliente privada, onde os casais veem, baixam e compartilham suas galerias de fotos, gerenciada por um painel administrativo.</b>
</p>

<p align="center">
<i>Desenvolvido para um cliente real (Rodrigo Alflen Fotografia, Paraná), este projeto substitui um site legado cujo código-fonte não estava mais acessível. Ele tem dois objetivos: uma landing page fiel ao original, rápida e responsiva, que transforma visitantes em pedidos de orçamento; e um sistema seguro de entrega de fotos, que troca links de galerias de terceiros pela experiência própria do fotógrafo, do login e da recuperação de senha por e-mail até o download em alta resolução e os links privados só de visualização para a família.</i>
</p>

<h2 id="preview-pt">🖼️ Preview</h2>

<p align="center">
  <img src="docs/screenshots/home.png" alt="Landing page" width="48%" />
  <img src="docs/screenshots/client-area.png" alt="Login da área do cliente" width="48%" />
</p>
<p align="center">
  <img src="docs/screenshots/gallery.png" alt="Galeria do cliente com visualizador" width="48%" />
  <img src="docs/screenshots/admin.png" alt="Painel administrativo" width="48%" />
</p>

<h2 id="tech-pt">💻 Tecnologias</h2>

| Camada                  | Tecnologia                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Framework               | Next.js 16 (App Router, Server Components, Server Actions, Cache Components)                                                    |
| Interface               | React 19, TypeScript 5, CSS puro com design tokens (sem framework de UI), `next/font` (Cormorant Garamond, Jost, Pinyon Script) |
| Banco de dados          | PostgreSQL no Neon (conexão com pooling), Drizzle ORM, `postgres.js`                                                            |
| Armazenamento           | Cloudflare R2 (API S3), bucket privado, uploads com URL pré-assinada                                                            |
| Processamento de imagem | `sharp` (redimensionamento, WebP, remoção de EXIF)                                                                              |
| Autenticação            | Própria: `bcryptjs`, tokens de sessão opacos, cookies `httpOnly`                                                                |
| E-mail                  | Resend (e-mail transacional para recuperação de senha)                                                                          |
| Ferramentas             | ESLint, Jest, `tsx`, `drizzle-kit`                                                                                              |
| Hospedagem              | Vercel                                                                                                                          |

<h2 id="features-pt">🧾 Principais Funcionalidades</h2>

<h3>Site público</h3>

- **Landing page fiel ao original**, reconstruída a partir de um site legado: hero com carrossel de fotos, faixa de prêmios, manifesto, serviços, portfólio com filtros, sobre, processo, depoimentos em vídeo, FAQ, formulário de contato e rodapé.
- **Movimento com propósito:** estatísticas com contagem animada (uma única vez), fotos do hero em transição suave, faixa infinita de prêmios, rolagem suave entre âncoras com easing próprio e selo circular girando.
- **Comportamento pensado para celular, não só redimensionamento:** os serviços viram um seletor de abas com swipe, o "Como funciona" vira um carrossel com barra de progresso, e o portfólio mostra 6 fotos com o botão "Ver mais".
- **Mídia própria:** o vídeo de depoimento é um arquivo local que só é baixado depois do clique em play (`preload="none"`), sem prejudicar a velocidade da página.
- **Página de links (`/wp`)** com atalhos de orçamento que abrem o WhatsApp com mensagem pronta.
- **Páginas legais** (Política de Privacidade e Termos de Uso) escritas para a legislação brasileira (LGPD), com índice lateral fixo.
- **SEO:** dados estruturados (JSON-LD), Open Graph, URLs canônicas, `robots.txt` e `noindex` em todas as rotas privadas.

<h3>Área do cliente</h3>

- **Login e senha numéricos** gerados pelo administrador, com política contra senhas fáceis.
- **Recuperação de senha por e-mail** com links de uso único que expiram em 1 hora.
- **Lista de galerias** com capa, data do evento, quantidade de fotos e dias restantes.
- **Grade de fotos justificada** (retrato e paisagem lado a lado) e **visualizador em tela cheia** com teclado, swipe, pré-carregamento e foco preso no diálogo.
- **Downloads:** uma foto original ou a galeria inteira em **ZIP gerado em tempo real** e dividido em partes (até 350 MB ou 200 fotos cada) para respeitar os limites de tempo de ambientes serverless.
- **Links privados de compartilhamento:** o cliente cria um link para parentes verem as fotos **sem login, sem baixar e sem acesso aos arquivos originais**. Os links têm validade (7, 30, 90 dias ou a validade da galeria), contador de visualizações e podem ser desativados a qualquer momento.
- **Regras por galeria:** data de validade (padrão de 365 dias) e uma chave para permitir ou bloquear downloads.

<h3>Painel administrativo</h3>

- **Gestão de clientes:** cria contas com login e senha gerados automaticamente (exibidos uma única vez, com botões de copiar e de mensagem pronta para WhatsApp), edita dados, gera nova senha, desativa o acesso e exclui.
- **Gestão de galerias:** cria galerias, define validade e permissão de download.
- **Upload direto para o armazenamento:** as fotos vão do navegador direto para o R2 (3 em paralelo, com progresso), sem passar pelo limite de tamanho das funções serverless. O servidor valida cada arquivo e gera uma versão reduzida de 2000 px e uma miniatura de 640 px (WebP, **sem EXIF/GPS**).
- **Organização das fotos:** define a capa, move fotos para o início, ordena por nome (ordem natural) e exclui em lote (os arquivos também saem do armazenamento).

<h2 id="security-pt">🔐 Segurança</h2>

A segurança foi tratada como funcionalidade, e não como detalhe: fotos de casamentos e de famílias são dados privados.

| Preocupação               | Abordagem                                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Senhas                    | `bcrypt` (12 rounds), nunca salvas nem registradas em texto; a senha só é exibida uma vez, na criação                                                                                                                           |
| Sessões                   | Token aleatório de 256 bits em cookie `httpOnly`, `secure`, `SameSite=Lax` (prefixo `__Host-` em produção); só o **hash SHA-256** é guardado; cliente 30 dias, admin 8 horas; todas as sessões são encerradas ao trocar a senha |
| Força bruta               | Limite por IP e bloqueio da conta por 15 minutos após 5 erros, com contagem por **upsert atômico no Postgres** (funciona em serverless, sem Redis)                                                                              |
| Enumeração de usuários    | Respostas e tempos idênticos para login inexistente e senha errada (comparação com hash falso); a recuperação de senha responde igual exista ou não o e-mail, e faz o trabalho em `after()`                                     |
| Recuperação de senha      | Tokens com hash no banco, validade de 1 hora, uso único consumido em transação, pedidos anteriores invalidados, limites por e-mail e por IP                                                                                     |
| Autorização               | Toda página, Server Action e rota de API do painel confere o perfil de novo (layouts sozinhos não protegem navegações no cliente); toda foto é conferida contra dono, validade e permissão de download                          |
| Armazenamento privado     | O bucket não tem acesso público; os arquivos só saem por rotas autenticadas; os originais nunca são servidos nas telas nem nos links de compartilhamento                                                                        |
| Links de compartilhamento | Tokens de 256 bits (só o hash no banco, exibido uma vez), revogáveis, com validade e no máximo 10 ativos por galeria; expõem só imagens reduzidas e sem EXIF                                                                    |
| Uploads                   | URLs pré-assinadas restritas a uma chave e um tipo de conteúdo; arquivos revalidados com `sharp` (formato, limite de pixels, tamanho); a chave do arquivo precisa pertencer à galeria de destino                                |
| CSRF                      | Verificação de mesma origem em todas as rotas de API que alteram dados; Server Actions usam a proteção nativa do Next.js                                                                                                        |
| Endurecimento HTTP        | CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `poweredByHeader: false`, `noindex` nas áreas privadas                                                                                  |
| Ataques de tempo          | Comparações em tempo constante (`timingSafeEqual`) onde segredos são comparados                                                                                                                                                 |

<h2 id="architecture-pt">🏗️ Arquitetura</h2>

<h3>Estrutura do projeto</h3>

```text
├── public/                      # Arquivos estáticos (logo, portfólio, depoimentos)
├── scripts/                     # Scripts operacionais
│   ├── create-user.ts           # Cria conta de admin/cliente pelo terminal
│   ├── check-env.ts             # Validação do ambiente antes do deploy
│   ├── audit-storage.ts         # Compara o bucket do R2 com o banco
│   └── optimize-images.mjs      # Pipeline de otimização de imagens
├── src/
│   ├── app/
│   │   ├── page.tsx             # Landing page
│   │   ├── wp/                  # Página de links
│   │   ├── cliente/             # Login, galerias e recuperação de senha
│   │   ├── ver/[token]/         # Página pública só de visualização
│   │   ├── admin/               # Painel (login + área protegida)
│   │   ├── politica-de-privacidade/ e termos-de-uso/
│   │   └── api/                 # Route Handlers (auth, fotos, ZIP, uploads)
│   ├── components/              # Seções, área do cliente, admin, legal, UI
│   ├── db/                      # Schema do Drizzle e conexão
│   └── lib/                     # auth/, security/, storage/, email/, gallery/, admin/
└── drizzle.config.ts
```

<h3>Modelo de dados</h3>

```mermaid
erDiagram
    USERS ||--o{ GALLERIES : possui
    USERS ||--o{ SESSIONS : tem
    USERS ||--o{ PASSWORD_RESETS : solicita
    USERS ||--o{ SHARE_LINKS : cria
    GALLERIES ||--o{ PHOTOS : contem
    GALLERIES ||--o{ SHARE_LINKS : expoe
    USERS {
        uuid id PK
        enum role
        text login
        text email
        text password_hash
        boolean active
        timestamptz locked_until
    }
    GALLERIES {
        uuid id PK
        uuid user_id FK
        text title
        date event_date
        timestamptz expires_at
        boolean allow_download
    }
    PHOTOS {
        uuid id PK
        uuid gallery_id FK
        text original_key
        text preview_key
        text thumb_key
        int position
    }
    SHARE_LINKS {
        uuid id PK
        uuid gallery_id FK
        text token_hash
        timestamptz expires_at
        timestamptz revoked_at
        int view_count
    }
    SESSIONS {
        uuid id PK
        uuid user_id FK
        text token_hash
        timestamptz expires_at
    }
    PASSWORD_RESETS {
        uuid id PK
        uuid user_id FK
        text token_hash
        timestamptz used_at
    }
    RATE_LIMITS {
        text key PK
        int count
        timestamptz reset_at
    }
```

<h3>Pipeline de upload de fotos</h3>

```mermaid
sequenceDiagram
    autonumber
    participant A as Admin (navegador)
    participant API as API Next.js
    participant R2 as Cloudflare R2
    participant DB as Neon Postgres
    A->>API: POST /fotos/sign (tipo e tamanho)
    API-->>A: URL PUT pré-assinada (10 min)
    A->>R2: PUT do original (upload direto)
    A->>API: POST /fotos/process (chave do objeto)
    API->>R2: lê o original
    API->>API: sharp gera preview 2000px e miniatura 640px (WebP, sem EXIF)
    API->>R2: grava preview e miniatura
    API->>DB: registra a foto
    API-->>A: id da foto
```

<h3>Design system</h3>

| Token          | Valor     | Uso                                     |
| -------------- | --------- | --------------------------------------- |
| `--brown`      | `#3e2a1f` | Texto principal, botões, seções escuras |
| `--accent`     | `#a8825d` | Destaques, links, ícones                |
| `--cream`      | `#f1e8df` | Seções alternadas                       |
| `--cream-soft` | `#faf6f1` | Cartões e fundos suaves                 |

A tipografia combina **Cormorant Garamond** (títulos), **Jost** (texto) e **Pinyon Script** (assinaturas), todas carregadas com `next/font`.

<h2 id="started-pt">🚀 Primeiros Passos</h2>

<h3>Pré-requisitos</h3>

- Node.js 20.9 ou superior
- Git
- Um projeto PostgreSQL no [Neon](https://neon.tech) (o plano gratuito serve)
- Um bucket no [Cloudflare R2](https://developers.cloudflare.com/r2/) (privado)
- Uma conta no [Resend](https://resend.com) (opcional em desenvolvimento: sem chave, os e-mails aparecem no terminal)

<h3>Clonando</h3>

```bash
git clone https://github.com/jglucian0/rodrigoalflen-lp
cd rodrigoalflen-lp
npm install
```

<h3>Configurando as variáveis .env</h3>

Copie o `.env.example` para `.env.local` e preencha os valores:

```yaml
DATABASE_URL="postgres://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"
APP_URL="http://localhost:3000"
RESEND_API_KEY=""
EMAIL_FROM="Rodrigo Alflen Fotografia <onboarding@resend.dev>"
R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
```

| Variável         | Descrição                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`   | String de conexão do Neon. Use o host **direto** localmente e o host **com pooling** (`-pooler`) em produção. **Não** inclua `channel_binding=require` |
| `APP_URL`        | Endereço público do site, usado nos links dos e-mails. Em produção, com `https://` e sem barra no final                                                |
| `RESEND_API_KEY` | Chave da API do Resend. Vazia em desenvolvimento imprime os e-mails no terminal                                                                        |
| `EMAIL_FROM`     | Remetente. Em produção exige domínio verificado                                                                                                        |
| `R2_*`           | Credenciais e nome do bucket do Cloudflare R2. Use um **bucket separado** para desenvolvimento                                                         |

<h3>Banco de dados e primeiro administrador</h3>

```bash
npm run db:push                                          # cria as tabelas
npm run user:create -- admin "Seu Nome" voce@email.com   # mostra a senha gerada (uma única vez)
npm run db:studio                                        # opcional: navegador visual do banco
```

<h3>Configurando o Cloudflare R2</h3>

1. Crie um bucket **sem acesso público**.
2. Crie um token de API com **Object Read & Write**, restrito a esse bucket.
3. Adicione esta política de CORS para o navegador poder enviar direto (inclua também o domínio de produção, sem barra no final):

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://seu-dominio.com.br"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

<h3>Iniciando</h3>

```bash
npm run dev       # servidor de desenvolvimento em http://localhost:3000
npm run build     # build de produção
npm start         # serve o build de produção
```

<h3>Scripts</h3>

| Script                                                | Descrição                                                                                    |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `npm run dev` / `build` / `start`                     | Fluxo padrão do Next.js                                                                      |
| `npm run lint` / `npm test`                           | ESLint e Jest                                                                                |
| `npm run db:push`                                     | Sincroniza o schema do Drizzle com o banco                                                   |
| `npm run db:studio`                                   | Abre o Drizzle Studio                                                                        |
| `npm run user:create -- <admin\|client> "Nome" email` | Cria uma conta com credenciais geradas                                                       |
| `npm run check:env`                                   | Valida as variáveis de ambiente antes do deploy                                              |
| `npm run storage:audit`                               | Compara o bucket com o banco (somente leitura; `-- --delete` remove sobras com mais de 24 h) |
| `npm run optimize:images`                             | Otimiza as imagens de `public/`                                                              |

<h2 id="routes-pt">📍 Rotas</h2>

<h3>Páginas</h3>

| rota                                                              | descrição                                                            |
| ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| <kbd>/</kbd>                                                      | Landing page                                                         |
| <kbd>/wp</kbd>                                                    | Página de links com atalhos de orçamento                             |
| <kbd>/cliente</kbd>                                               | Login do cliente (redireciona para as galerias se já estiver logado) |
| <kbd>/cliente/galeria</kbd>                                       | Lista de galerias do cliente (exige login)                           |
| <kbd>/cliente/galeria/[id]</kbd>                                  | Galeria: grade, visualizador, downloads e links de compartilhamento  |
| <kbd>/cliente/recuperar-senha</kbd>                               | Pede o e-mail de recuperação de senha                                |
| <kbd>/cliente/redefinir-senha?token=…</kbd>                       | Cria a nova senha a partir do link do e-mail                         |
| <kbd>/ver/[token]</kbd>                                           | Galeria pública só de visualização (sem login e sem download)        |
| <kbd>/admin/entrar</kbd>                                          | Login do administrador                                               |
| <kbd>/admin</kbd>                                                 | Painel: lista de clientes (exige perfil de admin)                    |
| <kbd>/admin/clientes/novo</kbd> e <kbd>/admin/clientes/[id]</kbd> | Cadastro e gestão de clientes e de suas galerias                     |
| <kbd>/admin/galerias/[id]</kbd>                                   | Configurações da galeria, envio e organização de fotos               |
| <kbd>/politica-de-privacidade</kbd> e <kbd>/termos-de-uso</kbd>   | Páginas legais                                                       |

<h3>Endpoints da API</h3>

| rota                                                   | descrição                                                                                     |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| <kbd>POST /api/cliente/login</kbd>                     | Valida login e senha numéricos e abre a sessão. [detalhes](#post-login-pt)                    |
| <kbd>POST /api/cliente/logout</kbd>                    | Encerra a sessão atual.                                                                       |
| <kbd>POST /api/cliente/recuperar-senha</kbd>           | Envia o e-mail de recuperação. Responde sempre da mesma forma.                                |
| <kbd>POST /api/cliente/redefinir-senha</kbd>           | Consome o token de recuperação e define a nova senha.                                         |
| <kbd>GET /api/cliente/fotos/:photoId/:variant</kbd>    | Entrega `thumb`, `preview` ou `download` (original) após conferir dono, validade e permissão. |
| <kbd>GET /api/cliente/galerias/:id/zip?part=N</kbd>    | Entrega uma parte do ZIP da galeria (gerado em tempo real).                                   |
| <kbd>GET /api/ver/:token/fotos/:photoId/:variant</kbd> | Entrega `thumb` ou `preview` para um link de compartilhamento válido. Nunca o original.       |
| <kbd>POST /api/admin/login</kbd>                       | Login do administrador por e-mail e senha.                                                    |
| <kbd>POST /api/admin/galerias/:id/fotos/sign</kbd>     | Autoriza um upload e devolve uma URL pré-assinada. [detalhes](#post-upload-pt)                |
| <kbd>POST /api/admin/galerias/:id/fotos/process</kbd>  | Valida o arquivo enviado, gera a versão reduzida e a miniatura e registra a foto.             |
| <kbd>GET /api/admin/fotos/:photoId/:variant</kbd>      | Acesso do administrador a `thumb` e `preview`.                                                |

<h3 id="post-login-pt">POST /api/cliente/login</h3>

**_REQUEST BODY_**

```json
{
  "login": "48213907",
  "password": "73918264"
}
```

**_RESPONSE_**

```json
{
  "redirect": "/cliente/galeria"
}
```

**_ERRO (mesmo corpo para login inexistente e senha errada)_**

```json
{
  "error": "Login ou senha incorretos."
}
```

<h3 id="post-upload-pt">Upload: sign e process</h3>

**_POST /api/admin/galerias/:id/fotos/sign_**

```json
{
  "filename": "IMG_0421.jpg",
  "contentType": "image/jpeg",
  "size": 8421937
}
```

```json
{
  "key": "galleries/9b2f…/orig/3c1e….jpg",
  "uploadUrl": "https://<bucket>.<account>.r2.cloudflarestorage.com/…"
}
```

Em seguida o navegador envia o arquivo com `PUT` direto para a `uploadUrl` e chama **POST /api/admin/galerias/:id/fotos/process** com `{ "key", "filename" }`.

<h2 id="deploy-pt">☁️ Deploy (Vercel)</h2>

1. Importe o repositório na Vercel.
2. Cadastre as variáveis de ambiente em **Production** (marque os segredos como _Sensitive_). O `R2_ACCOUNT_ID` também precisa estar disponível no **build**, porque a Content Security Policy libera o endereço de upload do R2.
3. Use a string do Neon **com pooling**, sem `channel_binding`.
4. Adicione o domínio de produção na política de **CORS** do bucket (origem exata, sem barra no final).
5. Verifique o domínio no Resend (SPF, DKIM e DMARC) antes de enviar e-mails reais.
6. Rode `npm run check:env` com os valores de produção antes do primeiro deploy.
7. Faça um novo deploy depois de alterar variáveis (elas só valem para deploys novos).

Use **uma branch do Neon e um bucket do R2 separados** para desenvolvimento, para que dados de teste e o `storage:audit --delete` nunca toquem a produção.

<h2 id="roadmap-pt">🗺️ Roadmap</h2>

- [ ] Autenticação em duas etapas para a conta de administrador
- [ ] Tela do admin para listar e revogar os links de compartilhamento dos clientes
- [ ] Limpeza automática de galerias expiradas e aviso por e-mail antes de expirar
- [ ] Backups automatizados (dump do banco e sincronização do armazenamento via GitHub Actions)
- [ ] Monitoramento de erros (Sentry)
- [ ] Testes automatizados dos fluxos críticos de segurança (login, recuperação, links de compartilhamento)

<h2 id="author-pt">🤝 Autor</h2>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/jglucian0">
        <img src="https://avatars.githubusercontent.com/u/169113323?v=4" width="100px;" alt="Foto de João Gabriel Luciano"/><br>
        <sub>
          <b>João Gabriel Luciano</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

Desenvolvido para **Rodrigo Alflen Fotografia**.

<h2 id="contribute-pt">📫 Contribuições</h2>

1. `git checkout -b feature/sua-feature`
2. Siga os padrões de commit (Conventional Commits).
3. Certifique-se de que `npm run lint` e `npm run build` passam.
4. Abra um Pull Request detalhando as alterações.

<h2 id="license-pt">📄 Licença</h2>

O código-fonte está disponível para fins de portfólio e consulta. Fotos, marca, logo e textos pertencem a **Rodrigo Alflen Fotografia** e não podem ser reutilizados.
