// Aikuisten tietovisan kysymyspankki
// ID-formaatti: ad-{aihe}-{numero}
//   Aiheprefiksit: yl=yleistieto, hi=historia, ti=tiede,
//                  ur=urheilu, ma=maantieto, vi=viihde
//
// Lisää uusia kysymyksiä kunkin aiheen loppuun ja jatka numerointia.

const TOPICS = [
  {
    id: 'yleistieto',
    name: 'Yleistieto',
    emoji: '🌍',
    color: ['rgba(37,99,235,0.12)', 'rgba(37,99,235,0.22)', '#1d4ed8'],
    questions: [
      { id: 'ad-yl-001', q: 'Kuinka monta maata on Euroopan unionissa (2024)?', a: 0, opts: ['27', '25', '30', '32'] },
      { id: 'ad-yl-002', q: 'Mikä on maailman pisin joki?', a: 1, opts: ['Amazoni', 'Niili', 'Jangtsejoki', 'Mississippi'] },
      { id: 'ad-yl-003', q: 'Kuinka monta väriä on sateenkaaressa?', a: 2, opts: ['5', '6', '7', '8'] },
      { id: 'ad-yl-004', q: 'Mikä on maailman korkein vuori?', a: 0, opts: ['Mount Everest', 'K2', 'Kangchenjunga', 'Makalu'] },
      { id: 'ad-yl-005', q: 'Kuinka monta planeettaa aurinkokunmassamme on?', a: 1, opts: ['7', '8', '9', '10'] },
      { id: 'ad-yl-006', q: 'Mikä on vesimolekyylin kemiallinen kaava?', a: 2, opts: ['HO', 'H₃O', 'H₂O', 'OH₂'] },
      { id: 'ad-yl-007', q: 'Montako tuntia on vuorokaudessa?', a: 0, opts: ['24', '22', '26', '20'] },
      { id: 'ad-yl-008', q: 'Montako siipeä mehiläisellä on?', a: 3, opts: ['2', '6', '8', '4'] },
      { id: 'ad-yl-009', q: 'Mikä on maailman väkirikkain maa (2024)?', a: 1, opts: ['Kiina', 'Intia', 'USA', 'Indonesia'] },
      { id: 'ad-yl-010', q: 'Kuinka monta kuukautta on vuodessa?', a: 2, opts: ['10', '11', '12', '13'] },
      // --- lisää uusia yleistieto-kysymyksiä tähän (ad-yl-011, ad-yl-012, ...) ---
    ]
  },
  {
    id: 'historia',
    name: 'Historia',
    emoji: '🏛️',
    color: ['rgba(180,83,9,0.12)', 'rgba(180,83,9,0.22)', '#92400e'],
    questions: [
      { id: 'ad-hi-001', q: 'Minä vuonna ensimmäinen maailmansota alkoi?', a: 1, opts: ['1912', '1914', '1916', '1918'] },
      { id: 'ad-hi-002', q: 'Kuka maalasi Mona Lisan?', a: 0, opts: ['Leonardo da Vinci', 'Michelangelo', 'Rafael', 'Botticelli'] },
      { id: 'ad-hi-003', q: 'Milloin Suomi itsenäistyi?', a: 2, opts: ['1915', '1916', '1917', '1918'] },
      { id: 'ad-hi-004', q: 'Missä kaupungissa Titanic rakennettiin?', a: 3, opts: ['Lontoossa', 'Liverpoolissa', 'Glasgowssa', 'Belfastissa'] },
      { id: 'ad-hi-005', q: 'Millä vuosikymmenellä ensimmäinen ihminen käveli Kuulla?', a: 1, opts: ['1950-luvulla', '1960-luvulla', '1970-luvulla', '1980-luvulla'] },
      { id: 'ad-hi-006', q: 'Mikä valtio lähetti ensimmäisenä ihmisen avaruuteen?', a: 0, opts: ['Neuvostoliitto', 'USA', 'Kiina', 'Ranska'] },
      { id: 'ad-hi-007', q: 'Kuka oli Suomen ensimmäinen presidentti?', a: 2, opts: ['Lauri Kr. Relander', 'P.E. Svinhufvud', 'K.J. Ståhlberg', 'Juho Kusti Paasikivi'] },
      { id: 'ad-hi-008', q: 'Milloin Berliinin muuri kaatui?', a: 1, opts: ['1988', '1989', '1990', '1991'] },
      { id: 'ad-hi-009', q: 'Missä vuodessa toinen maailmansota päättyi?', a: 2, opts: ['1943', '1944', '1945', '1946'] },
      { id: 'ad-hi-010', q: 'Mikä oli Napoleonin viimeinen tappio -taistelu?', a: 0, opts: ['Waterloo', 'Austerlitz', 'Leipzig', 'Moskova'] },
      // --- lisää uusia historia-kysymyksiä tähän (ad-hi-011, ad-hi-012, ...) ---
    ]
  },
  {
    id: 'tiede',
    name: 'Tiede & Luonto',
    emoji: '🔬',
    color: ['rgba(13,148,136,0.12)', 'rgba(13,148,136,0.22)', '#0f766e'],
    questions: [
      { id: 'ad-ti-001', q: 'Mikä on valon nopeus tyhjiössä (pyöristettynä)?', a: 3, opts: ['100 000 km/s', '150 000 km/s', '250 000 km/s', '300 000 km/s'] },
      { id: 'ad-ti-002', q: 'Mistä alkuaineesta timantit koostuvat?', a: 1, opts: ['Piistä', 'Hiilestä', 'Rikistä', 'Alumiinista'] },
      { id: 'ad-ti-003', q: 'Montako luuta on aikuisen ihmisen kehossa?', a: 2, opts: ['186', '196', '206', '216'] },
      { id: 'ad-ti-004', q: 'Mikä on maailman suurin nisäkäs?', a: 0, opts: ['Sinivalas', 'Elefantti', 'Virtahepo', 'Norsu'] },
      { id: 'ad-ti-005', q: 'Mikä planeetta on aurinkokunnan suurin?', a: 1, opts: ['Saturnus', 'Jupiter', 'Uranus', 'Neptunus'] },
      { id: 'ad-ti-006', q: 'Mitä fotosynteesissä syntyy?', a: 2, opts: ['Hiilidioksidia', 'Typpeä', 'Happea ja sokeria', 'Vettä'] },
      { id: 'ad-ti-007', q: 'Kuinka monta kromosomia on terveellä ihmisellä?', a: 3, opts: ['23', '32', '44', '46'] },
      { id: 'ad-ti-008', q: 'Mikä alkuaine merkitään Au?', a: 0, opts: ['Kulta', 'Hopea', 'Kupari', 'Rauta'] },
      { id: 'ad-ti-009', q: 'Kuinka monta alkuainetta on jaksollisessa järjestelmässä?', a: 2, opts: ['108', '112', '118', '124'] },
      { id: 'ad-ti-010', q: 'Mitä O₂ tarkoittaa?', a: 1, opts: ['Yksi happiatomi', 'Kaksi happiatomia', 'Happiioni', 'Happioksidi'] },
      // --- lisää uusia tiede-kysymyksiä tähän (ad-ti-011, ad-ti-012, ...) ---
    ]
  },
  {
    id: 'urheilu',
    name: 'Urheilu',
    emoji: '⚽',
    color: ['rgba(22,163,74,0.12)', 'rgba(22,163,74,0.22)', '#166534'],
    questions: [
      { id: 'ad-ur-001', q: 'Montako pelaajaa on jalkapallojoukkueessa kentällä?', a: 2, opts: ['9', '10', '11', '12'] },
      { id: 'ad-ur-002', q: 'Missä maassa jalkapallon MM-kisat järjestettiin 2022?', a: 0, opts: ['Qatarissa', 'Brasiliassa', 'Venäjällä', 'Saksassa'] },
      { id: 'ad-ur-003', q: 'Mitä urheilulajia Mika Häkkinen edusti?', a: 1, opts: ['Rallya', 'Formula 1:tä', 'Moottoripyöräilyä', 'Karting-ajoa'] },
      { id: 'ad-ur-004', q: 'Montako pelaajaa on jääkiekkojoukkueessa kentällä kerralla?', a: 3, opts: ['4', '5', '7', '6'] },
      { id: 'ad-ur-005', q: 'Mikä on yleisurheilun lyhyin juoksumatka olympialaisissa?', a: 2, opts: ['50 m', '60 m', '100 m', '200 m'] },
      { id: 'ad-ur-006', q: 'Missä kaupungissa järjestettiin 1952 kesäolympialaiset?', a: 0, opts: ['Helsingissä', 'Tukholmassa', 'Oslossa', 'Kööpenhaminassa'] },
      { id: 'ad-ur-007', q: 'Mitä urheilulajia Toni Nieminen edusti?', a: 1, opts: ['Hiihto', 'Mäkihyppy', 'Ampumahiihto', 'Yhdistetty'] },
      { id: 'ad-ur-008', q: 'Kuinka monta pelaajaa on koripallojoukkueessa kentällä?', a: 2, opts: ['4', '6', '5', '7'] },
      { id: 'ad-ur-009', q: 'Missä vuodessa Suomi voitti jääkiekon MM-kultaa ensimmäistä kertaa?', a: 1, opts: ['1993', '1995', '1998', '2001'] },
      { id: 'ad-ur-010', q: 'Kenellä on eniten Grand Slam -voittoja tennishistoriassa (2024)?', a: 0, opts: ['Novak Djokovic', 'Rafael Nadal', 'Roger Federer', 'Andy Murray'] },
      // --- lisää uusia urheilu-kysymyksiä tähän (ad-ur-011, ad-ur-012, ...) ---
    ]
  },
  {
    id: 'maantieto',
    name: 'Maantieto',
    emoji: '🗺️',
    color: ['rgba(234,88,12,0.12)', 'rgba(234,88,12,0.22)', '#9a3412'],
    questions: [
      { id: 'ad-ma-001', q: 'Mikä on Suomen pääkaupunki?', a: 0, opts: ['Helsinki', 'Turku', 'Tampere', 'Espoo'] },
      { id: 'ad-ma-002', q: 'Mikä on Euroopan suurin maa pinta-alaltaan?', a: 1, opts: ['Ukraina', 'Venäjä', 'Ranska', 'Ruotsi'] },
      { id: 'ad-ma-003', q: 'Millä mantereella Brasilia sijaitsee?', a: 2, opts: ['Pohjois-Amerikassa', 'Afrikassa', 'Etelä-Amerikassa', 'Aasiassa'] },
      { id: 'ad-ma-004', q: 'Mikä on maailman pienin valtio?', a: 0, opts: ['Vatikaani', 'Monaco', 'San Marino', 'Liechtenstein'] },
      { id: 'ad-ma-005', q: 'Kuinka monta mannerta maailmassa on?', a: 3, opts: ['5', '4', '6', '7'] },
      { id: 'ad-ma-006', q: 'Mikä on Afrikan korkein vuori?', a: 1, opts: ['Mount Kenya', 'Kilimanjaro', 'Atlas', 'Rwenzori'] },
      { id: 'ad-ma-007', q: 'Missä maassa Tokyo sijaitsee?', a: 2, opts: ['Kiinassa', 'Koreassa', 'Japanissa', 'Taiwanissa'] },
      { id: 'ad-ma-008', q: 'Mikä on maailman suurin valtameri?', a: 0, opts: ['Tyyni valtameri', 'Atlantti', 'Intian valtameri', 'Arktinen'] },
      { id: 'ad-ma-009', q: 'Mikä on Suomen pisin joki?', a: 1, opts: ['Oulujoki', 'Kemijoki', 'Kokemäenjoki', 'Iijoki'] },
      { id: 'ad-ma-010', q: 'Missä maassa sijaitsee Taj Mahal?', a: 2, opts: ['Pakistanissa', 'Bangladeshissa', 'Intiassa', 'Sri Lankassa'] },
      // --- lisää uusia maantieto-kysymyksiä tähän (ad-ma-011, ad-ma-012, ...) ---
    ]
  },
  {
    id: 'viihde',
    name: 'Elokuvat & Musiikki',
    emoji: '🎬',
    color: ['rgba(219,39,119,0.12)', 'rgba(219,39,119,0.22)', '#9d174d'],
    questions: [
      { id: 'ad-vi-001', q: 'Kuka esitti "Bohemian Rhapsody" -kappaleen?', a: 0, opts: ['Queen', 'The Beatles', 'Led Zeppelin', 'Rolling Stones'] },
      { id: 'ad-vi-002', q: 'Kuka ohjasi "Titanic" (1997) -elokuvan?', a: 1, opts: ['Steven Spielberg', 'James Cameron', 'Ridley Scott', 'Christopher Nolan'] },
      { id: 'ad-vi-003', q: 'Mikä bändi esitti "Smells Like Teen Spirit"?', a: 2, opts: ['Pearl Jam', 'Soundgarden', 'Nirvana', 'Alice in Chains'] },
      { id: 'ad-vi-004', q: 'Kuka näytteli Iron Mania Marvel-elokuvissa?', a: 0, opts: ['Robert Downey Jr.', 'Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'] },
      { id: 'ad-vi-005', q: 'Mikä on maailman myydyin albumi kautta aikojen?', a: 1, opts: ['Back in Black', 'Thriller', 'Dark Side of the Moon', 'Hotel California'] },
      { id: 'ad-vi-006', q: 'Kuka sävelsi "Finlandia"-teoksen?', a: 2, opts: ['Armas Järnefelt', 'Oskar Merikanto', 'Jean Sibelius', 'Toivo Kuula'] },
      { id: 'ad-vi-007', q: 'Missä vuodessa "Star Wars" (Episodi IV) ensi-ilta oli?', a: 0, opts: ['1977', '1979', '1975', '1980'] },
      { id: 'ad-vi-008', q: 'Mikä suomalainen yhtye tunnetaan kappaleesta "Wish I Had an Angel"?', a: 1, opts: ['HIM', 'Nightwish', 'Apocalyptica', 'Children of Bodom'] },
      { id: 'ad-vi-009', q: 'Kuinka monta Oscar-palkintoa "Taru sormusten herrasta: Kuninkaan paluu" voitti?', a: 3, opts: ['8', '9', '10', '11'] },
      { id: 'ad-vi-010', q: 'Mikä on Disney-elokuvien klassikko vuodelta 1994?', a: 2, opts: ['Aladdin', 'Kaunotar ja hirviö', 'Leijonakuningas', 'Pocahontas'] },
      // --- lisää uusia viihde-kysymyksiä tähän (ad-vi-011, ad-vi-012, ...) ---
    ]
  },
];
