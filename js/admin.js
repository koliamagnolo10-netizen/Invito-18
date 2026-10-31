const SUPABASE_URL = "https://ghimmpnpbkthrtoeqgv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaW1tcG5icGt0aHJ0b2FlcWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5MzIyNTksImV4cCI6MjEwODUwODI1OX0.OfZbq06ool_JiJoVvBItKcvkrQrIharq1myujg-ODTM";

// Usiamo dbSupabase per evitare conflitti con la libreria importata nell'HTML
const dbSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
  caricaInvitati();

  const form = document.getElementById('form-invitato');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await aggiungiInvitato();
    });
  }
});

async function caricaInvitati() {
  const tbody = document.getElementById('tabella-invitati');
  const counter = document.getElementById('counter-invitati');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-neutral-500">Caricamento in corso...</td></tr>`;

  // Interroga la tabella 'invitati' su Supabase
  const { data, error } = await dbSupabase
    .from('invitati')
    .select('*')
    .order('nome', { ascending: true });

  tbody.innerHTML = '';

  if (error) {
    console.error("Errore caricamento da Supabase:", error.message);
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-rose-400">Errore di caricamento: ${error.message}</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-neutral-500">Nessun invitato trovato nel database</td></tr>`;
    if (counter) counter.textContent = "0 invitati";
    return;
  }

  if (counter) counter.textContent = `${data.length} invitati`;

  data.forEach(inv => {
    const linkInvito = `${window.location.origin}/lettera.html?id=${inv.id}`;
    
    const statoRisposta = inv.risposta || inv.Risposta;
    let statoBadge = '<span class="text-amber-400">In attesa ⏳</span>';
    if (statoRisposta === 'SI') statoBadge = '<span class="text-emerald-400 font-semibold">Confermato (Sì) 🎉</span>';
    if (statoRisposta === 'NO') statoBadge = '<span class="text-rose-400 font-semibold">Rifiutato (No) ❌</span>';

    const nomeCompleta = `${inv.nome || inv.Nome || ''} ${inv.cognome || inv.Cognome || ''}`;
    const categoriaInv = inv.categoria || inv.Categoria || 'Amici';

    const tr = document.createElement('tr');
    tr.className = "border-b border-neutral-800 hover:bg-neutral-900/50";
    tr.innerHTML = `
      <td class="py-3 px-4 font-medium text-white">${nomeCompleta}</td>
      <td class="py-3 px-4 text-neutral-400">${categoriaInv}</td>
      <td class="py-3 px-4">${statoBadge}</td>
      <td class="py-3 px-4 text-right">
        <button onclick="copiaLink('${linkInvito}')" class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs py-1.5 px-3 rounded-lg transition cursor-pointer">
          Copia Link 🔗
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function aggiungiInvitato() {
  const nomeInput = document.getElementById('nome');
  const cognomeInput = document.getElementById('cognome');
  const categoriaInput = document.getElementById('categoria');

  const nome = nomeInput.value.trim();
  const cognome = cognomeInput.value.trim();
  const categoria = categoriaInput ? categoriaInput.value : 'Amici';

  if (!nome || !cognome) {
    alert("Inserisci nome e cognome!");
    return;
  }

  // Inserisce i dati su Supabase usando dbSupabase
  const { error } = await dbSupabase
    .from('invitati')
    .insert([
      { nome: nome, cognome: cognome, categoria: categoria, risposta: 'IN_ATTESA' }
    ]);

  if (error) {
    alert("Errore durante il salvataggio: " + error.message);
    console.error(error);
  } else {
    nomeInput.value = '';
    cognomeInput.value = '';
    caricaInvitati();
    alert("Invito generato e salvato con successo! 🎉");
  }
}

function copiaLink(url) {
  navigator.clipboard.writeText(url);
  alert("Link copiato negli appunti! Incollalo su WhatsApp per inviarlo.");
}