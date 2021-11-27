import Link from 'next/link';

import styles from './header.module.scss';

interface HeaderProps {
  className: string;
}

export default function Header({ className }: HeaderProps): JSX.Element {
  return (
    <header className={`${styles.container} ${className}`}>
      <Link href="/">
        <a>
          <img src="/images/spacetraveling.png" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
