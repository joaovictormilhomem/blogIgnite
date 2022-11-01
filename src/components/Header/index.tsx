import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header>
      <div className={styles.header_content}>
        <Image
          width={239}
          height={27}
          src="/images/logo.svg"
          alt="spacetraveling"
        />
        <div />
      </div>
    </header>
  );
}
