import styles from './ContactBox.module.scss';

export default function ContactBox(): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <div className={styles.about}>
          <div className={styles.avatars}>
            <img
              src="/andrew.png"
              srcSet="/andrew.png 1x, andrew@2x.png 2x"
              alt="Andrew Lee Avatar"
            />
            <img
              src="/han.png"
              srcSet="/han.png 1x, han@2x.png 2x"
              alt="Han Lee Avatar"
            />
          </div>
          <p>
            from{' '}
            <a
              href="https://andrewlee.design/"
              target="_blank"
              rel="noopener noreferrer"
            >
              andrew
            </a>{' '}
            &amp;{' '}
            <a
              href="https://www.linkedin.com/in/bonafidehan/"
              target="_blank"
              rel="noopener noreferrer"
            >
              han
            </a>{' '}
            (vo ppl)
          </p>
        </div>
        <a
          className={styles.email}
          href="mailto:hello@vo.land"
          target="_blank"
          rel="noopener noreferrer"
        >
          email us
        </a>
      </div>
    </div>
  );
}
