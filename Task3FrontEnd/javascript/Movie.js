const role = getUserRole();
//get Moives
$(document).ready(function () {
    $.ajax({
        url: 'https://localhost:7110/api/Movies/GetMovies',
        type: 'GET',
        contentType: 'application/json',
        success: function (data) {
            //console.log(data);
            data.forEach(function (movie) {
                $('.movie-container').append(`
                    <div class="movie-card" data-id=${movie.id}>
                        <div>
                            <img src="${movie.posterUrl}" alt="Poster" width="50" height="50" class="poster">
                        </div>
                        <div>
                            <h2 class="title">${movie.title}</h2>
                            <p><strong>${movie.director}</strong></p>
                            <p><strong>${movie.genre}</strong></p>
                            <p><strong>${movie.year}</strong></p>
                            <p><strong>${movie.rating}</strong></p>
                            <a href="${movie.vidUrl}" class="button">Watch Movie</a>
                            <a href="details.html?id=${movie.id}" class="button">Movie Details</a>
                        </div>
                    </div>
                `);
            });
            if (role == "Admin") {
                $('.movie-card').append(`
                    <button class="delete-button">Delete</button>
                `);
                $('nav').append(`<a id="create-movie">Add new Movie</a>`);
            }
        },
        error: function (data) {
            console.log(data.message);
        }   
    });
});

// Delete Movie
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete-button')) {
        let MovieCard = event.target.closest('.movie-card');

        let movieId = MovieCard.getAttribute('data-id');
        //console.log("Delete movie with id:", movieId);
        if (!movieId) {
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
                $.ajax({
                    url: `https://localhost:7110/api/Movies/DeleteMovie/${movieId}`,
                    type: 'DELETE',
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    success: function (data) {
                        console.log(data);
                        MovieCard.remove();
                    },
                    error: function (data) {
                        console.log(data.message);
                    }
                });
            }
        });
    }
});


// Create Movie
$(document).on('click', '#create-movie', function () {
    console.log("Create Movie");
    $('#popupForm').fadeIn();
});
$('#closeForm').click(function () {
    $('#popupForm').fadeOut();
});
$(document).ready(function () {
    $('#formContent').submit(function (event) {
        event.preventDefault();
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
        console.log(movie);
        $.ajax({
            url: 'https://localhost:7110/api/Movies/AddMovie',
            type: 'POST',
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
                //console.log(data);
                location.reload();
                $('#popupForm').fadeOut();
            },
            error: function (data) {
                console.log(data);
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


