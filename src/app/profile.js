import { getSession, signOut } from 'next-auth/react';

export default function Profile({ user }) {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Hello, {user.name || 'User'}!</h1>
      <p>Your email: {user.email}</p>
      <button
        onClick={() => signOut()}
        className="mt-3 px-4 py-2 bg-red-500 text-white rounded"
      >
        Sign Out
      </button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return { props: { user: session.user } };
}
