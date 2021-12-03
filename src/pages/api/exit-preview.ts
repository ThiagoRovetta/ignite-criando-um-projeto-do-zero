import url from 'url';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function exit(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  // Exit the current user from "Preview Mode". This function accepts no args.
  res.clearPreviewData();

  const queryObject = url.parse(req.url, true).query;

  // const redirectUrl = '/';
  const redirectUrl =
    queryObject && queryObject.currentUrl ? queryObject.currentUrl : '/';

  res.writeHead(307, { Location: redirectUrl });
  res.end();
}
