import Link from 'next/link';

import styles from './styles.module.scss';

interface PreviewProps {
  preview: boolean;
}

export function PreviewButton({ preview }: PreviewProps): JSX.Element {
  return (
    <>
      {preview && (
        <aside className={styles.container}>
          <Link href="/api/exit-preview">
            <a>Sair do modo Preview</a>
          </Link>
        </aside>
      )}
    </>
  );
}
