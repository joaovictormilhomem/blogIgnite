import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
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
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post?.data.title}</title>
      </Head>
      <Header />
      <div className={styles.post}>
        <img src={post?.data.banner.url} alt="banner" />
        <div className={styles.post_data}>
          <h1>{post?.data.title}</h1>
          <div className={styles.infos}>
            <div>
              <p>{post?.first_publication_date}</p>
            </div>
            <div>
              <p>{post?.data.author}</p>
            </div>
            <div>
              <p>5 min</p>
            </div>
          </div>
          <div className={styles.content}>
            {post?.data.content.map(content => (
              <div key={content.heading} className={styles.paragraph}>
                <h2>{content.heading}</h2>
                <div dangerouslySetInnerHTML={{ __html: content.body.text }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient({});
  // const posts = await prismic.getByType();

  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: {
            text: RichText.asHtml(content.body),
          },
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
  };
};
