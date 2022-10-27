import { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { getPrismicClient } from '../services/prismic';
// import commonStyles from '../styles/common.module.scss';
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
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  function handleLoadPostsClick() {
    fetch(nextPage)
      .then(res => res.json())
      .then(response => {
        const newPosts = response.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: new Date(
              post.last_publication_date
            ).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        setNextPage(response.next_page);
        setPosts(posts.concat(newPosts));
      });
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.logo}>
          <Image width={239} height={27} src="/images/logo.svg" alt="logo" />
        </div>
        <div className={styles.posts}>
          {posts.map(post => (
            <article key={post.uid}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div className={styles.infos}>
                <div className={styles.info}>
                  <Image
                    width={20}
                    height={20}
                    src="/images/calendar.svg"
                    alt="calendar"
                  />
                  <span>{post.first_publication_date}</span>
                </div>
                <div className={styles.info}>
                  <Image
                    width={20}
                    height={20}
                    src="/images/user.svg"
                    alt="calendar"
                  />
                  <span>{post.data.author}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {nextPage && (
          <span onClick={handleLoadPostsClick}>Carregar mais posts</span>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('posts', {
    fetch: ['publication.title', 'publication.subtitle', 'publication.author'],
    pageSize: 1,
  });
  const postsPagination = {
    next_page: response.next_page,
    results: response.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: new Date(
          post.last_publication_date
        ).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    }),
  };

  return {
    props: {
      postsPagination,
    },
  };
};
