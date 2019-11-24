//partie bouton aide
function afficher() {
  if (document.getElementById('aide').innerHTML == '?') {
    document.getElementById('aide').innerHTML = 'cacher';
    document.getElementById('cacher').style.display = 'block';
  } else {
    document.getElementById('aide').innerHTML = '?';
    document.getElementById('cacher').style.display = 'none';
  }
}

//Variables par défaut
let defaut = {
  // temps entre les touches
  "speed": 1000,
  // premier round
  "round": 1,
  // le joueur n'a pas encore joué
  "userGuess": 0
};

let runningGame = Object.assign({}, defaut);

//mode initial, easy
let hard = false;
//pas encore démarrer
let started = false;

//variables de jeu
let ElemJeu = {
  "round": document.getElementById("round"),
  "parties": document.getElementById("parties"),
  "message": document.getElementById("message"),
  "easy": document.getElementById("easy"),
  "hard": document.getElementById("hard")
}

// partie couleurs
//Supprime la couleur claire 
quart.prototype.hideBright = function() {
  this.component.classList.remove("bright");
}

//Ajout de la couleur claire partiellement
quart.prototype.bright = function(){
  const brightDuration = runningGame.speed - 100;
  this.hideBright();
  this.component.classList.add("bright");
  this.mask.style.animationDuration = runningGame.speed;
  const bright = this;
  setTimeout(function() {bright.hideBright()}, brightDuration); 
}

//sequence de jeu 
let sequence = { //generer une sequence
  //valeur par defaut lorsque cela ,n'a pas commencé
  "running": [],
  "playing": false,
  "index": 0,
  "play": function() { // ça joue
    this.playing = true;
    runningGame.userGuess = 0;
    var _this = this;

    setTimeout(function() { //boucler a nouveau la sequence
      const runningQuart = _this.running[_this.index];
      runningQuart.bright();
      _this.index++; // ajout au compteur de point
      if (_this.index < runningGame.round) { // si le compteur est inferieur, alors on joue de nouveau la sequence
        _this.play();
      } else {
        _this.playing = false;
      }
    }, runningGame.speed)
  },

  "generer": function() { // generateur sequence
    this.index = 0;
    this.running = [];
    const runningSequence = this.running;
    const consol = []; //garder sequence
    for (var j = 0; j < 10; j++) { //boucle 10 fois
      var randomQuart = parties[Math.floor(Math.random() * parties.length)]; // choix couleur
      runningSequence.push(randomQuart); //ajout couleur a la sequence
      consol.push(randomQuart.component.id);
    }
    console.log(consol); //affiche la sequence dans la console
  },
  /*"audioFiles" : {
              bleu: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
              vert: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
              jaune: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
              rouge: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
            }*/
};

//Variables couleurs
let bleu = new quart(sequence.bleu, "bleu");
let rouge = new quart(sequence.rouge, "rouge");
let jaune = new quart(sequence.jaune, "jaune");
let vert = new quart(sequence.vert, "vert");

let parties = [bleu, rouge, jaune, vert];

//tours
function ajoutScore() { //ajout score
  ElemJeu.round.innerHTML = runningGame.round;
}

//mode
function mode(mode) {
  const other = (mode === "hard") ? 'easy' : 'hard';
  hard = (mode === "hard") ? true : false;
  ElemJeu[other].classList.remove("active");
  ElemJeu[mode].classList.add("active");
}

//test son
/*son
function playSound(x) {
  switch (x) {
    case "#bleu":
      game.audioFiles.pink.play();
      break;
    case "#vert":
      game.audioFiles.blue.play();
      break;
    case "#jaune":
      game.audioFiles.green.play();
      break;
    case "#rouge":
      game.audioFiles.orange.play();
      break;
  }
  let son= new Audio();
}
*/

//Partie Quart 
function quart(Audio, component) {
  this.component = document.getElementById(component); 
  this.mask = this.component.childNodes[0];
  /*playSound();*/
}

//victoire
function win() {
  if (runningGame.userGuess >= sequence.running.length) {
    setTimeout(function() {
      restart()
    }, 7000);
  } else if (runningGame.userGuess >= runningGame.round) { // si le joueur a bon au tour
    runningGame.round++;
    ajoutScore(); // ajout score
    runningGame.speed -= 25; //plus rapide
    sequence.index = 0; //rejouer la sequence du debut
    sequence.play();
  }
}

//choix du joueur
function choix(quart) {
  if (sequence.playing || !started) {
    return;
  }
  if (sequence.running[runningGame.userGuess] === quart) { // si le joueur a bon
    runningGame.userGuess++;
    win(); // verification si il a gagner

  } else { // le jouer a tord
    error();
    if (hard === true) { // si le mode est hard
      setTimeout(function() {
        restart();
      }, 1100); //restart
    } else { // si le mode est easy
      runningGame.userGuess = 0; // le joueur peut réessayer
      sequence.index = 0; // rejouer la sequence
      setTimeout(function() {
        sequence.playing = false;
        sequence.play();
      }, 1100);
    }
  }
}

//erreur
function error() {
  sequence.playing = true;
  document.getElementById('over').innerHTML = "Game over";
}

//restart
function restart() {
  if (started === false) { //si la partie n'a pas commencé
    started = true; // la partie commence
    document.getElementById("playMsg").innerHTML = "RESTART?"; //change le texte
    document.getElementById("play").innerHTML = "&#8635;"; // change l'icon
    document.getElementById("replay").classList.remove("playMe");
  }
  runningGame = Object.assign({}, defaut); //retour des reglages par defaut
  ajoutScore(); // 
  sequence.generer(); // nouvelle sequence
  sequence.play(); // jouer la nouvelle sequence
}
