import Document, { Html, Head, Main, NextScript } from 'next/document';
import { repoName } from '../config/prismic';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Roboto:wght@400;700;900&display=swap"
            rel="stylesheet"
          />
          <script
            async
            defer
            src={`//static.cdn.prismic.io/prismic.js?repo=${repoName}&new=true`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
