export default function SubmitNotification({ user, correct }) {
  const message = correct ? `${user} got it right` : `${user} got it wrong`;

  return (
    <div className="submit-notification">
      <div className="submit-notification__box">
        <p className="submit-notification__text">{message}</p>
      </div>
    </div>
  );
}