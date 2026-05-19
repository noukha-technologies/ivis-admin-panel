const UnauthorizedPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-300">403</h1>
        <p className="mt-4 text-xl text-gray-500">
          You don't have permission to access this page
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
