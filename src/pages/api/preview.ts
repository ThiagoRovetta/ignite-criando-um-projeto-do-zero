import { NextApiRequest, NextApiResponse } from 'next';

import { linkResolver } from '../../config/prismic';
import { getPrismicClient } from '../../services/prismic';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> => {
  const { token: ref, documentId } = req.query;

  const prismic = getPrismicClient(req);

  const redirectUrl = await prismic
    .getPreviewResolver(String(ref), String(documentId))
    .resolve(linkResolver, '/');

  if (!redirectUrl) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.setPreviewData({ ref });

  res.write(
    `<!DOCTYPE html><html><head><meta http-equiv="Refresh" content="0; url=${redirectUrl}" />
    <script>window.location.href = '${redirectUrl}'</script>
    </head>`
  );
  return res.end();
};
