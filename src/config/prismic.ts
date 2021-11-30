import { Document } from '@prismicio/client/types/documents';

// -- Prismic Repo Name
export const repoName = 'criando-um-projeto-do-zero-thiago';

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export function linkResolver(doc: Document): string {
  if (doc.type === 'posts') {
    return `/post/${doc.uid}`;
  }
  return '/';
}

// -- Route Resolver rules
// Manages the url links to internal Prismic documents two levels deep (optionals)
export const router = {
  routes: [
    {
      type: 'post',
      path: '/blog/:uid',
    },
  ],
};
