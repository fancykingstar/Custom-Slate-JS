import SocialLinks from 'components/landing/SocialLinks';

import styles from './Footer.module.scss';

interface Props {
  showSocialLinks: boolean;
}

export default function Footer(props: Props): JSX.Element {
  const { showSocialLinks } = props;
  return (
    <footer className={styles.footer}>
      {showSocialLinks ? <SocialLinks /> : null}
      <p>&copy; 2020 Pattern Engine, Inc.</p>
    </footer>
  );
}
