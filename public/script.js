const form = document.querySelector("#movie-form");
const movieList = document.querySelector("#movies");

async function loadMovies() {
    const response = await fetch("/movies");
    const movies = await response.json();

    movieList.innerHTML = "";

    movies.forEach(movie => {
        const li = document.createElement("li");

        li.innerHTML = `
            <h3>${movie.title}</h3>
            <p>Director: ${movie.director}</p>
            <p>Year: ${movie.year}</p>

            <button onclick="editMovie(${movie.id})">Edit</button>
            <button onclick="deleteMovie(${movie.id})">Delete</button>
        `;

        movieList.appendChild(li);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const director = document.querySelector("#director").value;
    const year = document.querySelector("#year").value;

    const response = await fetch("/movies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            director: director,
            year: Number(year)
        })
    });

    if (response.ok) {
        form.reset();
        loadMovies();
    } else {
        alert("Failed to add movie");
    }
});

async function deleteMovie(id) {
    const response = await fetch(`/movies/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        loadMovies();
    } else {
        alert("Failed to delete movie");
    }
}

async function editMovie(id) {
    const title = prompt("Enter new movie title:");
    const director = prompt("Enter new director:");
    const year = prompt("Enter new year:");

    if (!title || !director || !year) {
        return;
    }

    const response = await fetch(`/movies/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: title,
            director: director,
            year: Number(year)
        })
    });

    if (response.ok) {
        loadMovies();
    } else {
        alert("Failed to edit movie");
    }
}

loadMovies();