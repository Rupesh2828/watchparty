const { data, error } = useSWR(
    '/api/users', 
    () => fetcher('/api/users', 'POST', { username, email, password }), 
    { revalidateOnFocus: false, shouldRetryOnError: false, isPaused: () => !username || !email || !password }
  );