
const searchButton = document.querySelector('.search-button');


searchButton.addEventListener('click', function () {
    const search = document.querySelector('.search-input').value;
    const movieContainer = document.querySelector('.movie-container');
    movieContainer.style.display = 'none';

    fetch(`https://localhost:7110/api/OMDB/GetMovieByTitle/${search}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);

            if (data.Response === "True") {
                const imdbUrl = `https://www.imdb.com/title/${data.imdbID}/`;
                const mainElement = document.querySelector('main');
                const newDiv = document.createElement('div');
                newDiv.classList.add('movie-container2');
                mainElement.appendChild(newDiv);

                newDiv.innerHTML = `
                    <div class="movie-card" data-id=${data.imdbID}>
                        <div>
                            <img src="${data.Poster}" alt="Poster" width="50" height="50" class="poster">
                        </div>
                        <div>
                            <h2 class="title">${data.Title}</h2>
                            <p><strong>${data.Director}</strong></p>
                            <p><strong>${data.Genre}</strong></p>
                            <p><strong>${data.Year}</strong></p>
                            <p><strong>${data.imdbRating}</strong></p>
                            <a href="${imdbUrl}" class="button">Watch Movie</a>
                            <a href="details.html?id=${data.imdbID}" class="button">Movie Details</a>
                        </div>
                    </div>
                `;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Movie not found!',
                });
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
});


document.addEventListener('DOMContentLoaded', function () {
    const categoryLinks = document.querySelectorAll('.category');
    
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const movieContainer = document.querySelector('.movie-container');
            const category = this.textContent;
            //console.log(category);
            
            fetch(`https://localhost:7110/api/OMDB/GetMovie/${category}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data); 
                    if (data && Array.isArray(data.Search)) {

                        movieContainer.innerHTML = '';
                        data.Search.forEach(item => {
                            //console.log(item);

                            const imdbUrl = `https://www.imdb.com/title/${item.imdbID}/`;
                            const movieCard = document.createElement('div');
                            movieCard.classList.add('movie-card');
                            movieCard.setAttribute('data-id', item.imdbID);

                            movieCard.innerHTML = `
                                <div>
                                    <img src="${item.Poster}" alt="Poster" width="50" height="50" class="poster">
                                </div>
                                <div>
                                    <h2 class="title">${item.Title}</h2>
                                    <p><strong>Year: </strong>${item.Year}</p>
                                    <a href="${imdbUrl}" class="button">Watch Movie</a>
                                    <a href="details.html?id=${item.imdbID}" class="button">Movie Details</a>
                                </div>
                            `;
                            movieContainer.appendChild(movieCard);
                        });
                    } else {
                        console.log("The data is not an array or missing 'Search' property:", data);
                    }
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        });
    });
});