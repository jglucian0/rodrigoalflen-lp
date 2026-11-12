import fs from 'fs/promises';
import { processDirectory, optimizeImage, processIsolatedFiles } from './optimizer-core.mjs';

async function main() {
  console.time('Tempo Total de Otimização');
  console.log('Iniciando pipeline de otimização de imagens...');

  const TARGET_ISOLATED_FILES = [
    'heroDestaque',
    'RodrigoAlflenPerson',
    'RodrigoAlflenFotografia',
    'RodrigoESuelenAbout',
    'RodigoIcon',
    'banner-cta',
  ];

  const targets = [
    processDirectory('public/portfolio'),
    processDirectory('public/portfolio/destaque'),
    processDirectory('public/depoimento'),
    processDirectory('public/servicos'),
    processIsolatedFiles('public', TARGET_ISOLATED_FILES)
  ];




  // Verifica a existência do arquivo isolado antes de processá-lo para evitar unhandled rejections
  const heroPath = 'public/heroDestaque.webp';
  const heroExists = await fs.access(heroPath).then(() => true).catch(() => false);

  if (heroExists) {
    targets.push(optimizeImage(heroPath));
  } else {
    console.warn(`[AVISO] Arquivo ausente ignorado: ${heroPath}`);
  }

  try {
    await Promise.all(targets);
    console.log('Pipeline concluído.');
    console.timeEnd('Tempo Total de Otimização');
  } catch (error) {
    console.error('Pipeline abortado devido a erro crítico.');
    process.exit(1);
  }
}

main();