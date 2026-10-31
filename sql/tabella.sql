DROP TABLE IF EXISTS invitati;

CREATE TABLE invitati (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    cognome TEXT NOT NULL,
    categoria TEXT DEFAULT 'Amici 🎉' CHECK (categoria IN (
        'Amici 🎉',
        'Amici Scuola 🎉',
        'Amici DopoScuola 🎉',
        'Amici Piscina 🎉',
        'Famiglia 🏡',
        'Parenti 🍷',
        'Conoscenti 🤝'
    )),
    risposta TEXT DEFAULT 'IN_ATTESA',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE invitati DISABLE ROW LEVEL SECURITY;