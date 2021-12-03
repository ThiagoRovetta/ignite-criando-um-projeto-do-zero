import { useEffect } from 'react';
import { useRouter, NextRouter } from 'next/router';
import Cookies from 'js-cookie';

import { repoName } from '../config/prismic';

function getExitPreviewRoute(router: NextRouter): string {
  const defaultPreviewExitUrl = '/api/exit-preview';

  const linkUrl = router.asPath
    ? `${defaultPreviewExitUrl}?currentUrl=${router.asPath}`
    : defaultPreviewExitUrl;

  return linkUrl;
}

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useUpdatePreview(previewRef: string, documentId: string): void {
  const router = useRouter();

  const previewExitRoute = getExitPreviewRoute(router);

  useEffect(() => {
    const updatePreview = async (): Promise<boolean> => {
      await timeout(1000);

      const rawPreviewCookie = Cookies.get('io.prismic.preview');

      const previewCookie = rawPreviewCookie
        ? JSON.parse(rawPreviewCookie)
        : null;

      const previewCookieObject = previewCookie
        ? previewCookie[`${repoName}.prismic.io`]
        : null;

      const previewCookieRef =
        previewCookieObject && previewCookieObject.preview
          ? previewCookieObject.preview
          : null;

      if (router.isPreview) {
        if (rawPreviewCookie && previewCookieRef) {
          if (previewRef !== previewCookieRef) {
            return router.push(
              `/api/preview?token=${previewCookieRef}&documentId=${documentId}`
            );
          }
        } else {
          return router.push(previewExitRoute);
        }
      } else if (rawPreviewCookie && previewCookieRef) {
        return router.push(
          `/api/preview?token=${previewCookieRef}&documentId=${documentId}`
        );
      }

      return undefined;
    };

    updatePreview();
  }, [documentId, previewExitRoute, previewRef, router]);
}
