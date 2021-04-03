const API_KEY = "27294941b248f6c55d4927966b7c5815";
const movie = "Avatar";

//search URL:
var base = "https://api.themoviedb.org/3/search/movie";
var api = `?api_key=${API_KEY}`;
var query = `&query=${movie}`;
var url = base + api + query;


//actors and director URL :
var base2 = "https://api.themoviedb.org/3/movie/";
var suite = "/credits";
var url_casting = "";

//check presence in a movie URL :
var base3 = "https://api.themoviedb.org/3/person/";
var suite2 = "/movie_credits";
var url_movie = "";


//get all the div of our HTML
var startMovie = document.getElementById("startMovie");
var startingQuiz = document.getElementById("startQuiz");
var quizContinue = document.getElementById("quizContinue");
var reload = document.getElementById("reload");
var playground = document.getElementById("playground");


//don't allow the user to enter the same movie twice
var temp = [];
var match = 0;
const noSameMovie = () => {
  startmovie = movie.toLowerCase();
  temp.push(startmovie); //we push the inital movie
  var title = document.getElementById("movie_guessed").value;
  title = title.toLowerCase();
  temp.push(title);
  match = 0;
  for (i = 0; i < temp.length; i++) {
    if (temp[i] == title) {
      match += 1;
    }
  }
  console.log(match);
  return match;
}

//display the first movie onload body
const startingMovie = async () => {
  fetch(url).then(function(response) {
    if(response.status != 200) {
      console.log("Error: " + response.status);
      return;
    } else {
      response.json().then(function(data) {
        var title = data.results[0].title;
        var release_date = data.results[0].release_date;
        var path_image = data.results[0].poster_path;
        var id = data.results[0].id;
        const infos = {
          'title': title,
          'date': release_date,
          'poster': path_image,
          'id': id
        }
        console.log(infos);
        startMovie.innerHTML += `<br><h3>${title}</h3><p>${release_date}</p><br><img src='https://www.themoviedb.org/t/p/w600_and_h900_bestv2${path_image}'><br>`;
        startingQuiz.innerHTML += `<div><form method = "post" onsubmit = "return false" autocomplete = "off"> <label>Can you guess an actor or the director of this movie: </label> <input id = "name_guessed"> <button id = "guess_button_cast" onclick = "StartQuiz('${id}')">GUESS</button> </form></div>`;
      });
    }
  });
}

//API results for actors
const getActors = async (name, url) => {
  return fetch(url).then(response => response.json()).then(data => {
    for (i = 0; i < data.cast.length; i++) { //cast
      if (data.cast[i].name.toLowerCase() == name) {
        if (data.cast[i].known_for_department == "Acting") {
          var actor = data.cast[i].name;
          var profile_picture = data.cast[i].profile_path;
          var id_actor = data.cast[i].id;
          const infos = {
            'actor': actor,
            'picture': profile_picture,
            'id': id_actor
          }
          return infos;
        }
      }
    }
  });
}

//API results for directors
const getDirector = async (name, url) => {
  return fetch(url).then(response => response.json()).then(data => {
    for (i = 0; i < data.crew.length; i++) { //crew
      if (data.crew[i].name.toLowerCase() == name) {
        if (data.crew[i].job == "Director") {
          var director = data.crew[i].name;
          var profile_picture = data.crew[i].profile_path;
          var id_director = data.crew[i].id;
          const infos = {
            'director': director,
            'picture': profile_picture,
            'id': id_director
          }
          return infos;
        }
      }
    }
  });
}

//API results for movies
const getMovie = async (movie, url) => {
  return fetch(url).then(response => response.json()).then(data => {
    for (i = 0; i < data.cast.length; i++) {
      if (data.cast[i].title.toLowerCase() == movie) {
        var title = data.cast[i].title;
        var path_image = data.cast[i].poster_path;
        var release_date = data.cast[i].release_date;
        var id_movie = data.cast[i].id;
        const infos = {
          'title': title,
          'poster': path_image,
          'date': release_date,
          'id': id_movie
        }
        return infos;
      }
    }
    for (j = 0; j < data.crew.length; j++) { //personnality as a member of the crew
      if (data.crew[j].title.toLowerCase() == movie) {
        var title = data.crew[j].title;
        var path_image = data.crew[j].poster_path;
        var release_date = data.crew[j].release_date;
        var id_movie = data.crew[j].id;
        const infos = {
          'title': title,
          'poster': path_image,
          'date': release_date,
          'id': id_movie
        }
        return infos;
      }
    }
  });
}

//start the quiz by guessing a first person, onclick event function
const StartQuiz = async (id) => {
  var name = document.getElementById("name_guessed").value;
  name = name.toLowerCase(); //search is case insensitive
  url_casting = base2 + id + suite + api;

  const actor = await getActors(name, url_casting);
  const director = await getDirector(name, url_casting);

  if (actor == undefined && director == undefined) {
    startingQuiz.innerHTML += `<p id = "bad_answer">Sorry, there is no ${name} implied in this movie, try again !</p>`;
  }
  else if (actor != undefined) {
    startingQuiz.innerHTML += `<p id = "good_answer">Good answer !!</p>`;
    console.log(actor);
    var people = actor.actor;
    var photo = actor.picture;
    var id_people = actor.id;
    if (photo == null) {
      startingQuiz.innerHTML += `<div><h3>${people}</h3><img src='https://i.imgur.com/yvgPWkI.png'><br></div>`;
      quizContinue.innerHTML += `<br><div> <form method = "post" onsubmit = "return false" autocomplete = "off"> <label>Can you guess a movie of this actor: </label><input id = "movie_guessed"> <button id = "guess_button_movie" onclick = "QuizContinue('${id_people}')">GUESS</button> </form></div>`;
      
    }
    else {
      startingQuiz.innerHTML += `<div><h3>${people}</h3><img src='https://www.themoviedb.org/t/p/w600_and_h900_bestv2${photo}'><br></div>`;
      quizContinue.innerHTML += `<br><div> <form method = "post" onsubmit = "return false" autocomplete = "off"> <label>Can you guess a movie of this actor: </label><input id = "movie_guessed"> <button id = "guess_button_movie" onclick = "QuizContinue('${id_people}')">GUESS</button> </form></div>`;
    }
  }
  else if (director != undefined) {
    startingQuiz.innerHTML += `<p id = "good_answer">Good answer !!</p>`;
    console.log(director);
    var people = director.director;
    var photo = director.picture;
    var id_people = director.id;
    if (photo == null) {
      startingQuiz.innerHTML += `<div><h3>${people}</h3><img src='https://i.imgur.com/yvgPWkI.png'><br></div>`;
      quizContinue.innerHTML += `<br><div> <form method = "post" onsubmit = "return false" autocomplete = "off"> <label>Can you guess a movie of this director: </label><input id = "movie_guessed"> <button id = "guess_button_movie" onclick = "QuizContinue('${id_people}')">GUESS</button> </form></div>`;
    }
    else {
      startingQuiz.innerHTML += `<div><h3>${people}</h3><img src='https://www.themoviedb.org/t/p/w600_and_h900_bestv2${photo}'><br></div>`;
      quizContinue.innerHTML += `<br><div> <form method = "post" onsubmit = "return false" autocomplete = "off"> <label>Can you guess a movie of this director: </label><input id = "movie_guessed"> <button id = "guess_button_movie" onclick = "QuizContinue('${id_people}')">GUESS</button> </form></div>`;  
    }
  }
}

//continue the quiz by guessing a new movie, onclick event function
const QuizContinue = async (id) => {
  var counter = noSameMovie();
  if (counter > 1) {
    quizContinue.innerHTML += `<p id = "bad_answer">Sorry, this movie has already been used, try again !</p>`;
  }
  else {
    var movie = document.getElementById("movie_guessed").value;
    movie = movie.toLowerCase(); //search is case insensitive
    url_movie = base3 + id + suite2 + api;

    const film = await getMovie(movie, url_movie);
    if (film == undefined) {
      quizContinue.innerHTML += `<p id = "bad_answer">Sorry... this person is not implied in ${movie}, try again !</p>`;
    }
    else {
      quizContinue.innerHTML += `<p id = "good_answer">Good answer !!</p>`;
      console.log(film);
      var titre = film.title;
      var poster = film.poster;
      var date = film.date;
      var id_movie = film.id;
      
      var new_infos = `${titre}--${poster}--${date}--${id_movie}`; //I choose this to split to avoid characters problems
      quizContinue.innerHTML += `<div><h3>${titre}</h3><p>${date}</p><br><img src='https://www.themoviedb.org/t/p/w600_and_h900_bestv2${poster}'><br></div>`;
      reload.innerHTML += `<div><button id = "reload_button" onclick = "Continue('${new_infos}')">Can you keep up ?</button></div>`;
    }
  }
}

//allow to reset the display and then to continue the game
const Continue = async (infos) => {
  var title = infos.split('--')[0];
  var poster = infos.split('--')[1];
  var date = infos.split('--')[2];
  var id = infos.split('--')[3];

  startMovie.remove();
  startingQuiz.remove();
  quizContinue.remove();
  document.getElementById("reload_button").remove();
  reload.remove();
  playground.innerHTML += `<div id = "startMovie"></div>
  <div id = "startQuiz"></div>
  <div id = "quizContinue"></div>
  <div id = "reload"></div>`;

  startMovie = document.getElementById("startMovie");
  startingQuiz = document.getElementById("startQuiz");
  quizContinue = document.getElementById("quizContinue");
  reload = document.getElementById("reload");

  startMovie.innerHTML += `<br><h3>${title}</h3><p>${date}</p><br><img src='https://www.themoviedb.org/t/p/w600_and_h900_bestv2${poster}'><br>`;
  startingQuiz.innerHTML += `<div> <form method = "post" onsubmit = "return false" autocomplete = "off"> <label>Can you guess an actor or the director of this movie: </label> <input id = "name_guessed"> <button id = "guess_button_cast" onclick = "StartQuiz('${id}')">GUESS</button> </form></div>`;
}