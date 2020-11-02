import styles from './FAQ.module.scss';

export default function FAQ(): JSX.Element {
  return (
    <section className={styles.faq}>
      <details>
        <summary>what is vo?</summary>
        <p>
          vo is an experimental social “app” built on the phone system! here’s
          what it is today:
        </p>
        <ol>
          <li>
            we connect you to a small group call we think you might have a good
            convo in
          </li>
          <li>after your call, we text you for feedback</li>
        </ol>
        <p>
          call vo as you walk, munch, relax, doodle, scroll, game, garden —
          whenever you’re up for an interesting chat.
        </p>
      </details>
      <details>
        <summary>rules?</summary>
        <ul>
          <li>no harassment</li>
          <li>no advertising</li>
          <li>no impersonating others</li>
          <li>be nice!</li>
        </ul>
      </details>
      <details>
        <summary>how do i report someone?</summary>
        <p>
          please reach out to{' '}
          <a
            href="mailto:support@vo.land"
            target="_blank"
            rel="noopener noreferrer"
          >
            support@vo.land
          </a>{' '}
          and include your phone number. we’ll respond as soon as possible.
        </p>
        <p>
          we’ll be implementing better ways to identify and report bad actors in
          the future.
        </p>
      </details>
      <details>
        <summary>are calls recorded?</summary>
        <p>nope! we don't listen in either.</p>
        <p>
          we’d tell you very clearly if we ever record and store something you
          say.
        </p>
      </details>
      <details>
        <summary>privacy &amp; data?</summary>
        <p>when you use vo, we store:</p>
        <ul>
          <li>your phone number</li>
          <li>a history of your vo calls</li>
          <li>if you opt-in to receive text messages</li>
        </ul>
        <p>we don’t share the above data with anybody.</p>
        <p>
          if you would like us to delete this data, reach out at{' '}
          <a
            href="mailto:support@vo.land"
            target="_blank"
            rel="noopener noreferrer"
          >
            support@vo.land
          </a>{' '}
          with your phone number. we’ll take care of it promptly.
        </p>
      </details>
      <details>
        <summary>how does vo make money?</summary>
        <p>
          we’re paying for vo out-of-pocket right now. if ppl really get into
          the concept, we’ll likely make it into a business. we don’t know what
          that would look like just yet!
        </p>
      </details>
    </section>
  );
}
