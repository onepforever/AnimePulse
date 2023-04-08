// animePulse.js

// Replace with your actual Bing News Search API key
const bingNewsApiKey = '8388305ec021421e9a7911e9c475133c';


// GraphQL query for searching anime using the AniList API
const SEARCH_ANIME_QUERY = `
  query ($search: String) {
    Page {
      media(search: $search, type: ANIME) {
        id
        title {
          english
          romaji
        }
        coverImage {
          medium
        }
        description
      }
    }
  }
`;

// Anime search and news search functionality on the search page
function searchAnimeAndNews() {
  // Get the search query from the input field
  const searchInput = document.querySelector('.search-input');
  const query = searchInput.value.trim();
  
  // Check if the query is not empty
  if (query.length > 0) {
    // AniList API URL
    const anilistApiUrl = 'https://graphql.anilist.co';

    // Bing News Search API URL
    const newsUrl = `https://api.bing.microsoft.com/v7.0/news/search?q=${encodeURIComponent(query)}&count=5&apiKey=${bingNewsApiKey}`;

    // Fetch data from the AniList API using a POST request with the GraphQL query
    fetch(anilistApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: SEARCH_ANIME_QUERY,
        variables: { search: query }
      })
    })
      .then(response => response.json())
      .then(data => {
        // Get the search results
        const results = data.data.Page.media;

        // Clear any previous search results
        const searchResultsDiv = document.querySelector('.anilist-search-results');
        searchResultsDiv.innerHTML = '';

        // Display search results
        results.forEach(anime => {
          const animeTitle = anime.title.english || anime.title.romaji;
          const animeImageUrl = anime.coverImage.medium;
          const animeDescription = anime.description;
          
          // Create and append the result element
          const resultDiv = document.createElement('div');
          resultDiv.classList.add('search-result-item');
          resultDiv.innerHTML = `
            <h3>${animeTitle}</h3>
            <img src="${animeImageUrl}" alt="${animeTitle}">
            <p>${animeDescription}</p>
          `;
          searchResultsDiv.appendChild(resultDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching anime search data:', error);
      });

    // Fetch data from the Bing News Search API
    fetch(newsUrl, {
      headers: {
        'Ocp-Apim-Subscription-Key': bingNewsApiKey // Include the API key in the request headers
      }
    })
      .then(response => response.json())
      .then(data => {
        // Get the news articles
        const newsArticles = data.value;

        // Display news articles
        const newsResultsDiv = document.querySelector('.news-search-results');
        newsResultsDiv.innerHTML = '';
        newsArticles.forEach(article => {
          const articleTitle = article.name;
          const articleUrl = article.url;
          const articleDescription = article.description;
                // Create and append the news article element
      const newsItemDiv = document.createElement('div');
      newsItemDiv.classList.add('news-result-item');
      newsItemDiv.innerHTML = `
        <h3><a href="${articleUrl}" target="_blank">${articleTitle}</a></h3>
        <p>${articleDescription}</p>
      `;
      newsResultsDiv.appendChild(newsItemDiv);
    });
  })
  .catch(error => {
    console.error('Error fetching news search data:', error);
  });
}

// Add event listener to the search button on the search page
const searchButton = document.querySelector('.search-button');
if (searchButton) {
searchButton.addEventListener('click', searchAnimeAndNews);
}
