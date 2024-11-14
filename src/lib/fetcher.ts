// Example of fetcher function:
export const fetcher = async (url: string, method: string, data: object) => {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'POST' ? JSON.stringify(data) : null, // Ensure the body is a string for POST
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    return response.json();
  };
  