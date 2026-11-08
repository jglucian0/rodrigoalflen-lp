import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

export async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) return false;

  const isWebp = ext === '.webp';
  const tempPath = `${filePath}.tmp`;
  const finalPath = isWebp ? filePath : filePath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');

  try {
    await sharp(filePath)
      .webp({ quality: 80, effort: 6 }) // effort 6 consome mais CPU, mas gera arquivos menores
      .toFile(tempPath);

    if (!isWebp) {
      await fs.unlink(filePath); // Elimina o arquivo original (PNG/JPG)
    }
    await fs.rename(tempPath, finalPath);
    console.log(`[OK] Otimizado: ${finalPath}`);
    return true;
  } catch (error) {
    console.error(`[ERRO] Falha ao otimizar ${filePath}:`, error.message);
    throw error;
  }
}

export async function processDirectory(dirPath) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const promises = entries
      // Filtrar por isFile() impede recursão acidental, resolvendo a 
      // sobreposição entre "portfolio" e "portfolio/destaque"
      .filter(entry => entry.isFile())
      .map(entry => optimizeImage(path.join(dirPath, entry.name)));

    await Promise.all(promises);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(`[ERRO] Falha ao ler diretório ${dirPath}:`, error.message);
      throw error;
    }
    console.warn(`[AVISO] Diretório ausente ignorado: ${dirPath}`);
  }
}

export async function processIsolatedFiles(dirPath, targetBaseNames) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    // Set para busca em O(1) ignorando case sensitivity
    const targets = new Set(targetBaseNames.map(name => name.toLowerCase()));

    const promises = entries
      .filter(entry => entry.isFile())
      .filter(entry => {
        const baseName = path.parse(entry.name).name.toLowerCase();
        return targets.has(baseName);
      })
      .map(entry => optimizeImage(path.join(dirPath, entry.name)));

    const results = await Promise.allSettled(promises);

    // Log de arquivos não encontrados
    const processedCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    if (processedCount < targets.size) {
      console.warn(`[AVISO] Apenas ${processedCount}/${targets.size} arquivos isolados encontrados em ${dirPath}`);
    }
  } catch (error) {
    console.error(`[ERRO] Falha ao processar arquivos isolados em ${dirPath}:`, error.message);
    throw error;
  }
}