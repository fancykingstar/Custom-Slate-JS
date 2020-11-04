// @ts-ignore
import MailchimpSubscribe from 'react-mailchimp-subscribe';

import HeroTextRotater from 'components/landing/HeroTextRotater';
import HeroNumbers from 'components/landing/HeroNumbers';

import styles from './MailChimp.module.scss';

const render = ({
  subscribe,
  status,
  message,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: any;
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let input: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitted = (formData: any): void => {
    subscribe(formData);
  };

  const submit = () => {
    if (input) {
      if (input.value.indexOf('@') > -1) {
        onSubmitted({
          EMAIL: input.value,
        });
      }
    }
  };

  let button = 'Request access';
  if (status === 'sending') {
    button = 'Sending…';
  }

  const disabled = status === 'sending';

  return (
    <div className={styles.wrapper}>
      <div className={styles.user}>
        <input
          className={styles.input}
          ref={(node) => {
            input = node;
          }}
          id="email"
          type="email"
          placeholder="Email"
          autoComplete="on"
        />
        <button
          className={styles.submit}
          onClick={submit}
          type="submit"
          disabled={disabled}
        >
          {button}
        </button>
      </div>
      <div className={styles.status}>
        {status === 'success' && 'Registered for early access.'}
        {status === 'error' && (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: message }}
          />
        )}
      </div>
    </div>
  );
};

export default function MailChimp(): JSX.Element {
  const url =
    'https://patternengine.us2.list-manage.com/subscribe/post?u=dac50e6a44a06a8f4e517052f&amp;id=3e38a1b7e9';

  return <MailchimpSubscribe url={url} render={render} />;
}
