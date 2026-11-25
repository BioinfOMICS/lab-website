/**
 * The one place the pages get their content from.
 *
 * Each JSON file in this folder is checked against a description of its shape when the
 * site is built. A missing field, a misspelt field name or a link that is not a link stops
 * the build with a message that names the file and the entry, so a mistake in a data file
 * cannot reach the published site.
 */
import { z } from 'astro/zod';

import siteRaw from './site.json';
import photosRaw from './photos.json';
import publicationsRaw from './publications.json';
import peopleRaw from './people.json';
import toolsRaw from './tools.json';
import researchRaw from './research.json';

// ---------- shapes ----------

const text = z.string().min(1, 'must not be empty');
const link = z.string().regex(/^https?:\/\/\S+$/, 'must be a full link starting with http:// or https://');

const SiteSchema = z.strictObject({
  name: text,
  description: text,
  footerNote: text,
  copyrightHolder: text,
  institution: text,
  location: text,
  affiliation: text,
  email: z.string().regex(/^\S+@\S+\.\S+$/, 'must be an email address'),
  phone: text,
  addressLines: z.array(text).min(1),
  mapQuery: text,
  /** Optional. The "Embed a map" link from Google Maps; leave "" to show no map. */
  mapEmbedUrl: z.union([z.literal(''), link]),
  /** The group leader's name as it is written in author lists; it is shown in bold. */
  nameInCitations: text,
});

const PhotoSchema = z.strictObject({
  file: text,
  alt: text,
  /** Which part of the photo to keep when it is cropped, e.g. "center 40%". */
  focus: text.optional(),
});

const PhotosSchema = z.strictObject({
  homeMosaic: z.array(PhotoSchema).length(5, 'the home page mosaic holds exactly five photos'),
  joinMain: PhotoSchema,
  joinLife: z.array(PhotoSchema).min(1),
});

const PublicationSchema = z.strictObject({
  authors: text,
  /** Only for old entries whose punctuation between authors and title is irregular. Normally left out. */
  joiner: z.string().optional(),
  title: text,
  journal: text,
  details: text,
  url: link,
  /** Shown in the home page's "Selected publications" list, in the order of this file. */
  featured: z.boolean().optional(),
});

const PublicationsSchema = z.strictObject({
  selected: z.array(PublicationSchema),
  other: z.array(z.strictObject({ year: text, items: z.array(PublicationSchema).min(1) })),
  books: z.array(PublicationSchema),
});

const PersonSchema = z.strictObject({
  name: text,
  nameZh: text.optional(),
  role: text,
  /** What the person is or was inside this lab, e.g. "Former Ph.D. student in the lab". Leave out if not applicable. */
  inLab: text.optional(),
  /** Leave out until a portrait is available; the card then shows the person's initials. */
  photo: text.optional(),
  position: text.optional(),
  education: z.array(text).default([]),
  interests: z.array(text).default([]),
});

const PeopleSchema = z.strictObject({
  pi: z.strictObject({
    name: text,
    nameZh: text.optional(),
    label: text,
    photo: text,
    affiliation: text,
    education: z.array(text).min(1),
    interests: z.array(text).min(1),
    experience: z.array(z.strictObject({ period: text, position: text })),
  }),
  /** One sentence for the home page that sums up who is in the group. Update it when people change. */
  summary: text,
  groups: z.array(
    z.strictObject({
      id: z.string().regex(/^[a-z][a-z0-9-]*$/, 'use lower-case letters, digits and hyphens'),
      title: text,
      /** The short line beside the heading. Update it when people change. */
      note: text,
      people: z.array(PersonSchema).min(1),
    }),
  ),
});

const ToolSchema = z.strictObject({
  /** Used in links such as /tools/#driverdb. */
  id: z.string().regex(/^[a-z][a-z0-9-]*$/, 'use lower-case letters, digits and hyphens'),
  name: text,
  kind: text,
  url: link,
  /** One sentence for the home page card. */
  summary: text,
  /** The longer text on the Tools page. */
  description: text,
  /** Newest first. */
  releases: z
    .array(
      z.strictObject({
        year: z.number().int().min(1990).max(2100),
        /** e.g. "DriverDB v4". A version written as "v4" at the end is picked up automatically. */
        label: text,
        journal: text,
        paper: link,
      }),
    )
    .min(1),
});

const ResearchSchema = z.strictObject({
  about: z.strictObject({ eyebrow: text, heading: text, paragraphs: z.array(text).min(1) }),
  topicsLabel: text,
  topics: z.array(text).min(1),
  fields: z.array(
    z.strictObject({
      id: z.enum(['bioinformatics', 'cancer-genomics', 'lipidomics', 'omics-analysis']),
      title: text,
      summary: text,
      /** Optional longer text for the Research page. Leave "" until it is written. */
      description: z.string(),
      /** Optional figure: a file name in src/assets/research/. Leave "" for none. */
      figure: z.string(),
      figureAlt: z.string(),
      /** "all", or a list of tool ids from tools.json. */
      related: z.union([z.literal('all'), z.array(text).min(1)]),
    }),
  ),
});

// ---------- loading ----------

function load<S extends z.ZodType>(file: string, schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (result.success) return result.data;
  const lines = result.error.issues.map((issue) => {
    const where = issue.path.reduce<string>(
      (acc, key) => (typeof key === 'number' ? `${acc}[${key}]` : acc ? `${acc}.${String(key)}` : String(key)),
      '',
    );
    return `  ${where || '(top level)'}: ${issue.message}`;
  });
  throw new Error(`src/data/${file} has a problem:\n${lines.join('\n')}`);
}

export const site = load('site.json', SiteSchema, siteRaw);
export const photos = load('photos.json', PhotosSchema, photosRaw);
export const publications = load('publications.json', PublicationsSchema, publicationsRaw);
export const people = load('people.json', PeopleSchema, peopleRaw);
export const tools = load('tools.json', z.array(ToolSchema).min(1), toolsRaw);
export const research = load('research.json', ResearchSchema, researchRaw);

export type Publication = z.infer<typeof PublicationSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type Tool = z.infer<typeof ToolSchema>;
export type Release = Tool['releases'][number];
export type ResearchField = (typeof research.fields)[number];

// ---------- checks across files ----------

{
  const ids = tools.map((t) => t.id);
  const repeated = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (repeated.length) throw new Error(`src/data/tools.json: the id "${repeated[0]}" is used more than once.`);
  for (const field of research.fields) {
    if (field.related === 'all') continue;
    for (const id of field.related) {
      if (!ids.includes(id)) {
        throw new Error(`src/data/research.json: field "${field.title}" names the tool "${id}", which is not in tools.json (ids there: ${ids.join(', ')}).`);
      }
    }
  }
}

// ---------- navigation ----------

export const nav = [
  { key: 'research', label: 'Research', href: '/research/' },
  { key: 'tools', label: 'Tools & Databases', href: '/tools/' },
  { key: 'publications', label: 'Publications', href: '/publications/' },
  { key: 'people', label: 'People', href: '/people/' },
  { key: 'join', label: 'Join Us', href: '/join/' },
  { key: 'contact', label: 'Contact', href: '/contact/' },
] as const;

export type NavKey = (typeof nav)[number]['key'];

// ---------- publications ----------

export const otherPublicationCount = publications.other.reduce((sum, group) => sum + group.items.length, 0);

export const publicationCount = publications.selected.length + otherPublicationCount + publications.books.length;

/**
 * Splits an author list around the group leader's name so it can be shown in bold.
 * A mark that follows the name, such as * for corresponding author, stays with the name.
 */
export function splitAuthors(authors: string): { before: string; name: string; after: string } {
  const start = authors.indexOf(site.nameInCitations);
  if (start < 0) return { before: authors, name: '', after: '' };
  let end = start + site.nameInCitations.length;
  while (end < authors.length && '*☨†‡#'.includes(authors[end])) end += 1;
  return { before: authors.slice(0, start), name: authors.slice(start, end), after: authors.slice(end) };
}

/** What stands between the author list and the title. */
export const joinerOf = (p: Publication): string => p.joiner ?? '. ';

// ---------- tools ----------

/** "v4" from "DriverDB v4"; "" when the label carries no version. */
export function versionOf(release: Release): string {
  return (release.label.match(/\bv\d+(?:\.\d+)?$/) ?? [''])[0];
}

export function latestRelease(tool: Tool): Release {
  return [...tool.releases].sort((a, b) => b.year - a.year)[0];
}

/** "driverdb.bioinfomics.org" from "http://driverdb.bioinfomics.org/" */
export function shortAddress(address: string): string {
  const u = new URL(address);
  return u.host + u.pathname.replace(/\/index\.html$/, '').replace(/\/$/, '');
}

export const toolById = (id: string): Tool => {
  const tool = tools.find((t) => t.id === id);
  if (!tool) throw new Error(`No tool with the id "${id}" in src/data/tools.json.`);
  return tool;
};

// ---------- people ----------

export const everyoneButLeader: Person[] = people.groups.flatMap((group) => group.people);

export const peopleCount = 1 + everyoneButLeader.length;
