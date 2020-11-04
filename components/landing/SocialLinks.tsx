import styles from './SocialLinks.module.scss';

export default function SocialLinks(): JSX.Element {
  return (
    <div className={styles.social}>
      <a
        href="https://www.twitter.com/deca10x"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/landing/twitter.svg" alt="Deca on Twitter" />
      </a>
      {/*
      <a
        href="https://www.reddit.com/r/deca10x/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/landing/reddit.svg" alt="Deca on Reddit" />
      </a>
      */}
      <a
        href="mailto:hello@patternengine.co"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/landing/mail.svg" alt="Email Deca" />
      </a>
    </div>
  );
}
