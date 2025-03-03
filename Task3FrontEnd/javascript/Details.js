const role = getUserRole();
const urlId = new URLSearchParams(window.location.search);
const movieId = urlId.get('id');
//console.log("Movie ID:", movieId);

if (Number.isInteger(Number(movieId))) {
    
    $(document).ready(function () {
        if (!movieId) {
            console.error("Error: Movie ID is undefined!");
            return;
        }

        $.ajax({
            url: `https://localhost:7110/api/Movies/GetMovie/${movieId}`,
            type: 'GET',
            contentType: 'application/json',
            success: function (data) {
                //console.log("Movie Data:", data);

                $('.movie-container').append(`
            <div class="movie-card" data-id="${data.id}">
                <img src="${data.posterUrl}" alt="Poster" class="poster">
                <div class="movie-info">
                    <h2 class="title">${data.title}</h2>
                    <p class="description"><strong>${data.description}</strong></p>
                    <p class="director"><strong>Director:</strong> ${data.director}</p>
                    <p class="genre"><strong>Genre:</strong> ${data.genre}</p>
                    <p class="year"><strong>Year:</strong> ${data.year}</p>
                    <p class="rating"><strong>Rating:</strong> ${data.rating}</p>
                    <div class="links">
                        <a href="${data.vidUrl}" class="button">Watch Movie</a>
                    </div>
                </div>
            </div>
        `);
                if (role === "Admin") {
                    $('.links').append(`
                <button class="edit-button button">Edit</button>
            `);
                }
            },
            error: function (xhr, status, error) {
                console.log("Response:", xhr.responseText);
            }
        });
    });
}
else {
    document.addEventListener('DOMContentLoaded', function () {
        fetch(`https://localhost:7110/api/OMDB/GetMovieById/${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log("Movie Data:", data);
                const imdbUrl = `https://www.imdb.com/title/${data.imdbID}/`;
                const movieContainer = document.querySelector('.movie-container');
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.setAttribute('data-id', data.id);
                movieCard.innerHTML = `
            <img src="${data.Poster}" alt="Poster" class="poster">
            <div class="movie-info">
                <h2 class="title">${data.Title}</h2>
                <p class="description"><strong>${data.Plot}</strong></p>
                <p class="director"><strong>Director:</strong> ${data.Director}</p>
                <p class="genre"><strong>Genre:</strong> ${data.Genre}</p>
                <p class="year"><strong>Year:</strong> ${data.Year}</p>
                <p class="rating"><strong>Rating:</strong> ${data.imdbRating}</p>
                <div class="links">
                    <a href="${imdbUrl}" class="button">Watch Movie</a>
                </div>
            </div>
        `;
                movieContainer.appendChild(movieCard);
            })
            .catch(error => {
                console.error("Fetch error:", error);
            });
    });
}

//edit movie
$(document).on('click', '.edit-button', function () {
    //console.log("Edit button clicked");
    $('#popupForm').fadeIn();
});
$('#closeForm').click(function () {
    $('#popupForm').fadeOut();
});

$(document).ready(function () {

    function extractMovieData() {
        const movieData = {};
        document.querySelectorAll(".movie-info p").forEach(p => {
            const key = p.className;
            const value = p.childNodes[1]?.nodeValue?.trim();
            movieData[key] = value;
        });

        return {
            title: document.querySelector("h2")?.innerText || "",
            movieData
        };
    }

    function fillForm() {
        const { title, movieData } = extractMovieData();
        const description = document.querySelector(".description")?.innerText || "";
        const posterUrl = document.querySelector(".poster")?.src || "";
        const vidUrl = document.querySelector(".links a")?.href || "";

        if ($('#formContent').length) {
            $('#title').val(title);
            $('#description').val(description);
            $('#director').val(movieData["director"] || "");
            $('#genre').val(movieData["genre"] || "");
            $('#year').val(movieData["year"] || "");
            $('#rating').val(movieData["rating"] || "");
            $('#posterUrl').val(posterUrl);
            $('#vidUrl').val(vidUrl);

        }
    }

    
    fillForm();

    
    const observer = new MutationObserver(() => {
        fillForm();
    });

    observer.observe(document.body, { childList: true, subtree: true });

   
    $(document).on('submit', '#formContent', function (event) {
        event.preventDefault();
        console.log("Form Submitted!");
        let movie = {
            title: $('#title').val(),
            description: $('#description').val(),
            director: $('#director').val(),
            genre: $('#genre').val(),
            year: $('#year').val(),
            rating: $('#rating').val(),
            posterUrl: $('#posterUrl').val(),
            vidUrl: $('#vidUrl').val()
        };
        //console.log(movie);
        console.log("Movie ID:", movieId);
        $.ajax({
            url: `https://localhost:7110/api/Movies/UpdateMovie/${movieId}`,
            type: 'PUT',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            data: JSON.stringify({
                title: movie.title,
                description: movie.description,
                vidUrl: movie.vidUrl,
                director: movie.director,
                genre: movie.genre,
                year: movie.year,
                rating: movie.rating,
                posterUrl: movie.posterUrl
            }),
            success: function (data) {
                console.log(data);
                location.reload();
                $('#popupForm').fadeOut();
            },
            error: function (data) {
                console.log(data.message);
            }
        });
    });
});



function getUserRole() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No token found");
        return null;
    }

    try {
        const payloadBase64 = token.split('.')[1];
        const payloadJSON = atob(payloadBase64);
        const payload = JSON.parse(payloadJSON);

        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } catch (error) {
        //console.error("Error decoding token:", error);
        return null;
    }
}