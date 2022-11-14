import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

function Header() {
  return (
    <header>
      <div className={styles.header_content}>
        <Link href="/">
          <a>
            <Image width={239} height={27} src="/images/logo.svg" alt="logo" />
          </a>
        </Link>
        <div />
      </div>
    </header>
  );
}

export default Header;
