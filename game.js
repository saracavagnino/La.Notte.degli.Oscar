// Estrae il parametro 'squadra'
const urlParams = new URLSearchParams(window.location.search);
const squadra = urlParams.get('squadra')?.toUpperCase();

// Sequenze per squadra
const squadre = {
  A: [1, 2, 3, 4, 5, 6],
  B: [2, 3, 4, 5, 1, 6],
  C: [3, 4, 5, 1, 2, 6],
  D: [4, 5, 1, 2, 3, 6],
  E: [5, 1, 2, 3, 4, 6],
};

// Mappa media indizi luogo
const images = {
  1: "img/punto_smat.jpg",
  2: "img/antenna.jpg",
  3: "audio/lavatoio.mp3", // audio al posto dell’immagine
  4: "img/madonna_palme.jpg",
  5: "img/altalene.jpg", 
  6: "img/oscar.jpg"
};

// Mappa indovinello
const hints = {
  1: "Quante farfalle ci sono sui lati delle porte?",
  2: "Qual è il suo numero civico?",
  3: "Fino a quante persone possono usarlo?",
  4: "Che cosa ha sui piedi?",
  5: "All’entrata, a sinistra, quali numeri ci sono sulla targhetta dopo il punto?",
  6: "Troverai indicazioni sul posto!"
};

//Mappa risposte corrette personalizzabili
const answers = {
  1: "14", //farfalle sul punto smat
  2: "2 BIS", //numero civico antenna
  3: "10", // numero posti lavatoio
  4: "rose", //palme
  5: "7863", //altalena
};

// Caricamento o reset
let progress = JSON.parse(localStorage.getItem(`progress_${squadra}`)) || {
  currentIndex: 0,
  visited: []
};

// Squadra non valida
if (!squadra || !squadre[squadra]) {
  document.body.innerHTML = "<p>Squadra non valida. Aggiungi '?squadra=A' all'URL.</p>";
} else {
  document.getElementById('game').classList.remove('hidden');
  showPage();
}

// Mostra pagina
function showPage() {
  const page = squadre[squadra][progress.currentIndex];

  const placeImage = document.getElementById('placeImage');
  const placeAudio = document.getElementById('placeAudio');

  if (page === 6) {
    document.getElementById('finalMessage').classList.remove('hidden');
    document.getElementById('hint').innerText = `Forza! ${hints[page]}`;
    placeImage.classList.remove('hidden');
    placeAudio.classList.add('hidden');
    placeImage.src = images[page];
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('feedback').innerText = '';
    document.getElementById("resetButton").style.display = "block";
  } else {
    document.getElementById('finalMessage').classList.add('hidden');
    document.getElementById('hint').innerText = `${hints[page]}`;
    document.getElementById('answer').value = "";
    document.getElementById('feedback').innerText = "";
    document.getElementById('inputSection').style.display = 'block';
    document.getElementById("resetButton").style.display = "none";

    if (page === 3) {
      placeImage.classList.add('hidden');
      placeAudio.classList.remove('hidden');
      placeAudio.querySelector('source').src = "audio/lavatoio.mp3";
      placeAudio.load();
    } else {
      placeAudio.classList.add('hidden');
      placeImage.classList.remove('hidden');
      placeImage.src = images[page];
    }
  }
}

// Verifica risposta
function checkAnswer() {
  const answer = document.getElementById('answer').value.trim();
  const page = squadre[squadra][progress.currentIndex];

  if (answer.toLowerCase() === answers[page]?.toLowerCase()) {
    if (!progress.visited.includes(page)) {
      progress.visited.push(page);
    }

    if (progress.visited.length >= 5) {
      progress.currentIndex = squadre[squadra].length - 1;
    } else {
      progress.currentIndex = (progress.currentIndex + 1) % (squadre[squadra].length - 1);
    }

    localStorage.setItem(`progress_${squadra}`, JSON.stringify(progress));
    showPage();
  } else {
    document.getElementById('feedback').innerText = "Risposta errata, riprova!";
  }
}

// Reset gioco
function resetGame() {
  if (confirm("Sei sicuro di voler resettare il gioco? Tutti i progressi saranno persi.")) {
    localStorage.removeItem(`progress_${squadra}`);
    location.href = `?squadra=${squadra}`;
  }
}
