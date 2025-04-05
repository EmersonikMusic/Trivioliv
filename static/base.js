const apiUrl = 'https://triviolivia.com/api/questions/'; // replace with your API endpoint URL

// make a fetch request to the API
fetch(apiUrl)
  .then(response => {
    // Parse the response as JSON
    return response.json();
  })
  .then(data => {
    // Log the returned JSON to the console
    console.log(data);
  })
  .catch(error => {
    // Log any errors to the console
    console.error(error);
  });