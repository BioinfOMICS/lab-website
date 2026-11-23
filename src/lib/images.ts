import type { ImageMetadata } from 'astro';

/**
 * Photos are looked up by file name, so the data files only need to say
 * "photo": "YLLai.jpg". A name that matches no file stops the build with a clear message.
 */
type Module = { default: ImageMetadata };

const people = import.meta.glob<Module>('../assets/people/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const lab = import.meta.glob<Module>('../assets/lab/*.{jpg,jpeg,png,webp,avif}', { eager: true });

function pick(modules: Record<string, Module>, folder: string, file: string): ImageMetadata {
  const found = modules[`../assets/${folder}/${file}`];
  if (!found) {
    const have = Object.keys(modules).map((k) => k.split('/').pop()).join(', ');
    throw new Error(`Photo "${file}" was not found in src/assets/${folder}/. Files there: ${have}`);
  }
  return found.default;
}

/** A portrait from src/assets/people/. */
export const personPhoto = (file: string): ImageMetadata => pick(people, 'people', file);

/** A lab photo from src/assets/lab/. */
export const labPhoto = (file: string): ImageMetadata => pick(lab, 'lab', file);

/** A figure for a research field, from src/assets/research/ (the folder is created when the first figure is added). */
const figures = import.meta.glob<Module>('../assets/research/*.{jpg,jpeg,png,webp,avif}', { eager: true });
export const researchFigure = (file: string): ImageMetadata => pick(figures, 'research', file);
