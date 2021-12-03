import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import { router } from '../config/prismic';

const createClientOptions = (
  req = null,
  prismicAccessToken = null,
  routes = null
): Record<string, unknown> => {
  const reqOption = req ? { req } : {};

  const accessTokenOption = prismicAccessToken
    ? { accessToken: prismicAccessToken }
    : {};

  const routesOption = routes ? { routes: router.routes } : {};

  return {
    ...reqOption,
    ...accessTokenOption,
    ...routesOption,
  };
};

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(
    process.env.PRISMIC_API_ENDPOINT,
    createClientOptions(req, process.env.PRISMIC_ACCESS_TOKEN, router)
  );

  return prismic;
}
