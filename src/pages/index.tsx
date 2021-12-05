import { useState } from 'react';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
      preview,
    },
  };
};

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const { next_page, results } = postsPagination;

  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(next_page);

  const handleLoadMorePosts = async (): Promise<void> => {
    const postsResponse = await fetch(postsPagination.next_page).then(
      response => response.json()
    );

    const postsResults = postsResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setNextPage(postsResponse.next_page);
    setPosts([...posts, ...postsResults]);
  };

  return (
    <>
      <Header className={styles.header} />
      <main className={`${styles.container} ${commonStyles.maxWidth}`}>
        {posts.map(post => (
          <div key={post.uid} className={styles.posts}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h3>{post.data.title}</h3>
                <strong>{post.data.subtitle}</strong>
                <div className={styles.info}>
                  <div>
                    <FiCalendar />
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
                </div>
              </a>
            </Link>
          </div>
        ))}
        {nextPage && (
          <button type="button" onClick={handleLoadMorePosts}>
            Carregar mais posts
          </button>
        )}
        {preview && (
          <aside>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}
