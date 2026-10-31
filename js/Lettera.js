const SUPABASE_URL = "https://ghimmpnpbkthrtoeqgv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaW1tcG5wYmt0aHJ0b2VxZ3YiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc5MjkzMjI1OSwiZXhwIjoyMTA4NTA4MjU5fQ.OfZbq06ool_JiJoVvBItKcvkrQrIharq1myujg-ODTM";

// Usiamo dbSupabase per evitare conflitti con la libreria globale
const dbSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const invitatoId = params.get('id');
  const nomeManuale = params.get('nome');

  const titoloNome = document.getElementById('invitato-nome');

  if (nomeManuale) {
    titoloNome.innerText = `Ciao ${decodeURIComponent(nomeManuale)}!`;
  } 
  else if (invitatoId) {
    // Usa dbSupabase per la chiamata
    const { data, error } = await dbSupabase
      .from('invitati')
      .select('*')
      .eq('id', invitatoId)
      .single();

    if (!error && data) {
      titoloNome.innerText = `Ciao ${data.nome || 'Ospite'}!`;
      
      if (data.risposta === 'SI') {
        evidenziaConferma();
      } else if (data.risposta === 'NO') {
        mostraRifiuto();
      }
    } else {
      titoloNome.innerText = "Ciao Ospite!";
    }
  } else {
    titoloNome.innerText = "Ciao Ospite!";
  }

  // Gestione click tasto SI
  document.getElementById('btn-si').addEventListener('click', async () => {
    evidenziaConferma();

    if (invitatoId) {
      await dbSupabase
        .from('invitati')
        .update({ risposta: 'SI' })
        .eq('id', invitatoId);
    }
    
    alert("Evviva! La tua presenza è stata confermata 🎉");
  });

  // Gestione click tasto NO
  document.getElementById('btn-no').addEventListener('click', async () => {
    mostraRifiuto();

    if (invitatoId) {
      await dbSupabase
        .from('invitati')
        .update({ risposta: 'NO' })
        .eq('id', invitatoId);
    }

    alert("Ci dispiace molto che tu non possa venire! 😢");
  });
});

function evidenziaConferma() {
  const msgBlocco = document.getElementById('msg-blocco');
  if (msgBlocco) {
    msgBlocco.innerHTML = '✨ <span class="text-emerald-400 font-semibold">Presenza confermata con successo! Ti aspettiamo.</span>';
  }

  const detailsBox = document.getElementById('details-box');
  if (detailsBox) {
    detailsBox.classList.remove('sfocato');
  }
}

function mostraRifiuto() {
  const msgBlocco = document.getElementById('msg-blocco');
  if (msgBlocco) {
    msgBlocco.innerHTML = '❌ <span class="text-rose-400 font-semibold">Hai indicato che non potrai partecipare. Grazie per aver risposto!</span>';
  }
}