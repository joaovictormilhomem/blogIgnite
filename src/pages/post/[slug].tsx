import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import Header from '../../components/Header';
import { createDateString } from '../../logic/string';
import { getPrismicClient } from '../../services/prismic';
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

function Post({ post }: PostProps) {
  const { isFallback } = useRouter();
  const formatedContent = post?.data.content.map(content => {
    return {
      heading: content.heading,
      body: {
        text: RichText.asHtml(content.body),
      },
    };
  });

  if (isFallback) {
    return <p>Carregando...</p>;
  }

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
              <p>{createDateString(post?.first_publication_date)}</p>
            </div>
            <div>
              <p>{post?.data.author}</p>
            </div>
            <div>
              <p>4 min</p>
            </div>
          </div>
          <div className={styles.content}>
            {formatedContent?.map(content => (
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

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');
  const paths = posts.results.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(slug), {});

  const post = {
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
    },
  };
};

export default Post;
