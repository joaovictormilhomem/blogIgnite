import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header>
      <div>
        <Image
          width={239}
          height={27}
          src="/images/logo.svg"
          alt="spacetraveling"
        />
      </div>
    </header>
  );
}
