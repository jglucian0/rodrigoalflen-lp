# Backup

## O que roda sozinho

Todo dia às 03:30 (Brasília), o workflow `.github/workflows/backup.yml`:

- salva um dump do banco (Neon, branch production) em `db/AAAA-MM-DD.dump`, guardando 30 dias;
- sincroniza as fotos para `photos/current/` no bucket de backup;
- arquivos apagados/alterados na produção ficam 30 dias em `photos/removed/<data>/`.

Se falhar, o GitHub manda e-mail. Rodar na mão: GitHub → Actions → Backup → Run workflow.

## Rotina mensal (5 minutos)

- [ ] GitHub → Actions: os últimos backups estão verdes?
- [ ] Cloudflare → bucket de backup: existe o dump de ontem?
- [ ] `npm run storage:audit` (somente leitura; nunca use `--delete` com bucket de teste misturado)
- [ ] Neon e Resend: uso e erros normais?
- [ ] A cada 6 meses: fazer um teste real de restauração (abaixo).

## Segredos (GitHub → Settings → Secrets → Actions)

BACKUP_DATABASE_URL (conexão DIRETA da Neon, sem -pooler e sem channel_binding),
R2_ACCOUNT_ID, R2_PROD_BUCKET, R2_PROD_READ_KEY_ID, R2_PROD_READ_SECRET,
R2_BACKUP_BUCKET, R2_BACKUP_KEY_ID, R2_BACKUP_SECRET.
Se trocar a senha do banco na Neon, atualize BACKUP_DATABASE_URL.
Se trocar as chaves do R2, atualize os secrets correspondentes.

## Restaurar o banco

1. Baixe o dump desejado: Cloudflare → bucket de backup → `db/` → Download.
2. SEMPRE teste primeiro em um banco vazio (na Neon: branch development → Databases → novo banco).
3. Com as ferramentas de linha de comando do PostgreSQL instaladas (mesma versão da Neon ou maior):

   pg_restore --no-owner --no-privileges --dbname "<URL DIRETA do banco de destino>" AAAA-MM-DD.dump

   Para restaurar sobre um banco que já tem tabelas, acrescente `--clean --if-exists`
   (isso APAGA os dados atuais: só em emergência, e de preferência em um branch novo).

4. Aponte o `DATABASE_URL` da Vercel para o banco restaurado e faça Redeploy.
   Para voltar só alguns minutos/horas atrás, o histórico da própria Neon (Restore) é mais rápido.

## Restaurar fotos

Fotos que sumiram da produção ficam em `photos/current/` (estado mais recente) e
`photos/removed/<data>/` (apagadas nos últimos 30 dias). Para copiar de volta
(PowerShell, com rclone instalado; o destino precisa de um token de leitura e escrita na produção):

$env:RCLONE_CONFIG_R2BACKUP_TYPE="s3"
$env:RCLONE_CONFIG_R2BACKUP_PROVIDER="Cloudflare"
$env:RCLONE_CONFIG_R2BACKUP_ACCESS_KEY_ID="..."
$env:RCLONE_CONFIG_R2BACKUP_SECRET_ACCESS_KEY="..."
$env:RCLONE_CONFIG_R2BACKUP_ENDPOINT="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
$env:RCLONE_CONFIG_R2BACKUP_NO_CHECK_BUCKET="true"
$env:RCLONE_CONFIG_R2PROD_TYPE="s3"
$env:RCLONE_CONFIG_R2PROD_PROVIDER="Cloudflare"
$env:RCLONE_CONFIG_R2PROD_ACCESS_KEY_ID="..."
$env:RCLONE_CONFIG_R2PROD_SECRET_ACCESS_KEY="..."
$env:RCLONE_CONFIG_R2PROD_ENDPOINT="https://<ACCOUNT_ID>.r2.cloudflarestorage.com"
$env:RCLONE_CONFIG_R2PROD_NO_CHECK_BUCKET="true"

rclone copy "r2backup:<BUCKET_BACKUP>/photos/current" "r2prod:<BUCKET_PROD>/galleries" --progress

Para recuperar uma galeria apagada, as fotos voltam pelo comando acima, mas as linhas no banco
(tabela photos) vêm do dump do banco, restaurado em um banco temporário.
