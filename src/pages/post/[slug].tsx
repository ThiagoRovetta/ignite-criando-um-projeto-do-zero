// eslint-disable-next-line no-use-before-define
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './post.module.scss';
import commonStyles from '../../styles/common.module.scss';

import { useUpdatePreview } from '../../hooks/useUpdatePreviewRef';
import { getPrismicClient } from '../../services/prismic';
import Custom404 from '../404';
import { Loader } from '../../components/Loader';
import Header from '../../components/Header';

interface Post {
  id: string;
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  previewRef: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const posts = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      pageSize: 1,
    }
  );

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const {
    params: { slug },
    previewData,
  } = context;

  const previewRef = previewData?.ref ?? null;
  const refOption = previewRef ? { ref: previewRef } : null;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), refOption);

  const post = {
    id: response.id,
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
      previewRef,
    },
  };
};

export default function Post({ post, previewRef }: PostProps): JSX.Element {
  const router = useRouter();

  const estimatedReadingTime = Math.ceil(
    post?.data?.content?.reduce((previous, current) => {
      const headingNumberOfWords = current.heading.split(' ').length;
      const bodyNumberOfWords = RichText.asText(current.body)
        .replace(/\n\n|\r?\n|\r/g, ' ')
        .split(' ').length;

      return previous + (headingNumberOfWords + bodyNumberOfWords) / 200;
    }, 0)
  );

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  if (!post.id) {
    return <Custom404 />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useUpdatePreview(previewRef, post.id);

  return (
    <>
      <Header className={styles.header} />
      <img src={post.data.banner.url} alt="banner" />
      <main className={`${styles.container} ${commonStyles.maxWidth}`}>
        <article className={styles.post}>
          <h1>{post.data.title}</h1>
          <div className={styles.info}>
            <div>
              <AiOutlineCalendar />
              <time>
                {format(new Date(post.first_publication_date), 'PP', {
                  locale: ptBR,
                })}
              </time>
            </div>
            <div>
              <FiUser />
              <p>{post.data.author}</p>
            </div>
            <div>
              <AiOutlineClockCircle />
              <p>{estimatedReadingTime} min</p>
            </div>
          </div>
          <div className={styles.content}>
            {post.data.content.map(content => (
              <React.Fragment key={content.heading}>
                <strong>{content.heading}</strong>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </React.Fragment>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}
