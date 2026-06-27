export default function SubmitNotification({ user, correct }) {
  return (
    <>
      {correct ? (
        <p>{user} got it right</p>
      ) : (
        <p>{user} got it wrong</p>
      )}
    </>
  );
}