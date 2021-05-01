window.onload = () => {
    const addMovieButton = document.getElementById("addMovieButton")
    const myMovies = document.getElementById("mymovies")
    const addArea = document.getElementById("addArea")
    const addForm = document.getElementById("addForm")
    const searchBar = document.getElementById("searchBar")
    const searchMoviesDiv = document.getElementById("searchMovies")
    const movies = document.getElementById("movies")

    const storedMoviesFromStorage = localStorage.getItem("movies")

    if(storedMoviesFromStorage != null) {
        const storedMoviesJSON = JSON.parse(storedMoviesFromStorage)
        Object.keys(storedMoviesJSON).forEach(key => {
            const movie = storedMoviesJSON[key]
            if(movie.movieImage != null && movie.movieName != null) {
                movies.innerHTML += `<div class="card">
                <div style="text-align: center;">
                    <img src="https://image.tmdb.org/t/p/w300${movie.movieImage}" width="200">
                </div>
                <h3 class="title">
                    ${movie.movieName}
                </h3>
                <p class="small-text">
                    Rating given: ${movie.movieRating}/10  
                </p>
                <p class="small-text">
                    ${movie.movieReview}
                </p>
                <div style="text-align: center;">
                    <button class="btn addMovie-btn"  onclick="deleteMovie('${movie.movieName}')">Delete Movie</button>
                </div>
            </div>`
            }  
        })
        myMovies.style.marginTop = "7rem"
        myMovies.style.height = "fit-content"
    }

    addMovieButton.addEventListener('click', () => {
        myMovies.style.display = "none"
        addArea.style.display = "flex"
    })

    addForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const searchQuery = searchBar.value
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=c467ddab940734b55111748d4ef3b4da&query=${searchQuery}&page=1`, {method: 'GET'})
        .then(async (response) => {
            const responseJSON = await response.json()
            const searchMovies = responseJSON.results
            console.log(searchMovies)
            searchMovies.forEach(movie => {
                if(movie.poster_path != null && movie.title != null) {
                    searchMoviesDiv.innerHTML += `<div class="card">
                    <div style="text-align: center;">
                        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" width="200">
                    </div>
                    <h3 class="title">
                        ${movie.title}
                    </h3>
                    <div style="text-align: center;">
                        <button class="btn addMovie-btn" onclick="addMovie('${movie.title}', '${movie.poster_path}')">Add Movie</button>
                    </div>
                    </div>`
                }  
            })
            addArea.style.height = "fit-content"
            addForm.style.marginTop = "7rem"
        })
    })
}

function addMovie(title, poster_path) {
    const storedMovies = localStorage.getItem("movies")
    const rating = prompt("Rate this movie out of 10")
    const review = prompt("Give a review")

    if(storedMovies == null) {
        const intialJSON = {}
        intialJSON["1"] = {movieName: title, movieImage: poster_path, movieRating: rating, movieReview: review}
        localStorage.setItem("movies", JSON.stringify(intialJSON))
    } else {
        let giveAlert = false
        const storedMoviesJSON = JSON.parse(storedMovies)
        Object.keys(storedMoviesJSON).forEach(key => {
            if(storedMoviesJSON[key].movieName == title) {
                giveAlert = true
            }
        })
        if(giveAlert == false) {
            let biggestKey = 1
            Object.keys(storedMoviesJSON).forEach(key => {
                if(Number(key) > biggestKey) {
                    biggestKey = Number(key)
                }
            })
            storedMoviesJSON[biggestKey+1] = {movieName: title, movieImage: poster_path, movieRating: rating, movieReview: review}
            localStorage.setItem("movies", JSON.stringify(storedMoviesJSON))
        } else {
            alert("You have already logged that movie")
        }
    }
    window.location.reload()

}

function deleteMovie(movieName) {
    const storedMovies = localStorage.getItem("movies")
    const storedMoviesJSON = JSON.parse(storedMovies)
    Object.keys(storedMoviesJSON).forEach(key => {
        if(storedMoviesJSON[key].movieName == movieName) {
            delete storedMoviesJSON[key]
            localStorage.setItem("movies", JSON.stringify(storedMoviesJSON))
            window.location.reload()
        }
    })
}