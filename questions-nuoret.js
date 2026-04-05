// Nuorten tietovisan kysymyspankki (10–15 v.)
// ID-formaatti: nu-{aihe}-{numero}
//   Aiheprefiksit: yl=yleistieto, el=eläimet, eo=elokuvat,
//                  ur=urheilu, ma=maantieto, pe=pelit
//
// Lisää uusia kysymyksiä kunkin aiheen loppuun ja jatka numerointia.

const TOPICS = [
  {
    id: 'yleistieto',
    name: 'Yleistieto',
    emoji: '🌍',
    color: ['rgba(37,99,235,0.12)', 'rgba(37,99,235,0.22)', '#1d4ed8'],
    questions: [
      { id: 'nu-yl-001', q: 'Kuinka monta planeettaa aurinkokunmassamme on?', a: 2, opts: ['6', '7', '8', '9'] },
      { id: 'nu-yl-002', q: 'Kuinka monta väriä sateenkaaressa on?', a: 2, opts: ['5', '6', '7', '8'] },
      { id: 'nu-yl-003', q: 'Mikä on maailman korkein rakennus?', a: 2, opts: ['Eiffel-torni', 'Empire State', 'Burj Khalifa', 'Tokyo Skytree'] },
      { id: 'nu-yl-004', q: 'Mikä eläin on maailman nopein maaeläin?', a: 1, opts: ['Leijona', 'Gepardi', 'Strutsi', 'Villihevonen'] },
      { id: 'nu-yl-005', q: 'Mikä on maailman pisin joki?', a: 1, opts: ['Amazoni', 'Niili', 'Jangtsejoki', 'Mississippi'] },
      { id: 'nu-yl-006', q: 'Mikä on maailman suurin valtameri?', a: 3, opts: ['Atlantti', 'Arktinen', 'Intian valtameri', 'Tyyni valtameri'] },
      { id: 'nu-yl-007', q: 'Montako tuntia on vuorokaudessa?', a: 1, opts: ['22', '24', '25', '26'] },
      { id: 'nu-yl-008', q: 'Kuinka monta päivää on karkausvuodessa?', a: 2, opts: ['364', '365', '366', '367'] },
      { id: 'nu-yl-009', q: 'Mikä on maailman äidinkieliltään eniten puhuttu kieli?', a: 2, opts: ['Englanti', 'Espanja', 'Mandariinikiina', 'Hindi'] },
      { id: 'nu-yl-010', q: 'Montako kuukautta on vuodessa?', a: 2, opts: ['10', '11', '12', '13'] },
      // --- lisää uusia yleistieto-kysymyksiä tähän (nu-yl-011, nu-yl-012, ...) ---
    ]
  },
  {
    id: 'elaimet',
    name: 'Eläimet & Luonto',
    emoji: '🐾',
    color: ['rgba(13,148,136,0.12)', 'rgba(13,148,136,0.22)', '#0f766e'],
    questions: [
      { id: 'nu-el-001', q: 'Montako jalkaa hämähäkillä on?', a: 2, opts: ['4', '6', '8', '10'] },
      { id: 'nu-el-002', q: 'Mikä on maailman suurin eläin?', a: 1, opts: ['Elefantti', 'Sinivalas', 'Hailevähai', 'Jättiläismanta'] },
      { id: 'nu-el-003', q: 'Missä maassa jättiläispanda elää luonnossa?', a: 2, opts: ['Japanissa', 'Australiassa', 'Kiinassa', 'Intiassa'] },
      { id: 'nu-el-004', q: 'Montako siipeä perhosella on?', a: 1, opts: ['2', '4', '6', '8'] },
      { id: 'nu-el-005', q: 'Mikä eläin rakentaa patoja ja asuu niiden takana?', a: 0, opts: ['Majava', 'Saukko', 'Näätä', 'Mäyrä'] },
      { id: 'nu-el-006', q: 'Mikä lintu ei osaa lentää?', a: 1, opts: ['Kotka', 'Strutsi', 'Pelikaani', 'Papukaija'] },
      { id: 'nu-el-007', q: 'Mitä eläimiä kutsutaan sammakkoeläimiksi?', a: 2, opts: ['Krokotiili ja kilpikonna', 'Käärme ja lisko', 'Sammakko ja salamanteri', 'Merimies ja ankka'] },
      { id: 'nu-el-008', q: 'Kuinka kauan elefantti kantaa poikastaan ennen synnytystä?', a: 3, opts: ['6 kuukautta', '12 kuukautta', '18 kuukautta', '22 kuukautta'] },
      { id: 'nu-el-009', q: 'Mikä on maailman suurin lintu?', a: 0, opts: ['Strutsi', 'Kotka', 'Pelikaani', 'Emu'] },
      { id: 'nu-el-010', q: 'Millä eläimellä on pisin kaula?', a: 1, opts: ['Kameli', 'Kirahvi', 'Flamingo', 'Strutsi'] },
      // --- lisää uusia eläimet-kysymyksiä tähän (nu-el-011, nu-el-012, ...) ---
    ]
  },
  {
    id: 'elokuvat',
    name: 'Elokuvat & Sarjat',
    emoji: '🎬',
    color: ['rgba(219,39,119,0.12)', 'rgba(219,39,119,0.22)', '#9d174d'],
    questions: [
      { id: 'nu-eo-001', q: 'Mikä on Harry Potterin taikakoulun nimi suomeksi?', a: 1, opts: ['Dumbledore', 'Tylypahka', 'Diagon', 'Azkaban'] },
      { id: 'nu-eo-002', q: 'Kenellä on jäätymisvoima Disneyn Frozen-elokuvassa?', a: 1, opts: ['Annalla', 'Elsalla', 'Kristoffilla', 'Olafilla'] },
      { id: 'nu-eo-003', q: 'Mistä elokuvasta on leijonapoika Simba?', a: 2, opts: ['Tarzan', 'Dumbo', 'Leijonakuningas', 'Bambi'] },
      { id: 'nu-eo-004', q: 'Mikä on Minecraft-pelin hiljaa hiipivä räjähtävä vihollinen?', a: 2, opts: ['Zombie', 'Skeleton', 'Creeper', 'Enderman'] },
      { id: 'nu-eo-005', q: 'Millä supersankarilla on hämähäkin voimia?', a: 2, opts: ['Batman', 'Superman', 'Hämähäkkimies', 'Hulk'] },
      { id: 'nu-eo-006', q: 'Mikä Disney-elokuva kertoo kalasta jonka poika katoaa?', a: 2, opts: ['Shark Tale', 'Atlantis', 'Etsitään Nemoa', 'Luca'] },
      { id: 'nu-eo-007', q: 'Mikä on Pixarin Toy Storyn tärkein päähenkilö?', a: 1, opts: ['Buzz Lightyear', 'Woody', 'Rex', 'Hamm'] },
      { id: 'nu-eo-008', q: 'Missä maassa tapahtuu Disneyn Mulan-elokuva?', a: 2, opts: ['Japanissa', 'Koreassa', 'Kiinassa', 'Thaimaassa'] },
      { id: 'nu-eo-009', q: 'Kuka sanoo "Hakuna Matata" Leijonakuninkaassa?', a: 1, opts: ['Simba', 'Timon ja Pumba', 'Rafiki', 'Mufasa'] },
      { id: 'nu-eo-010', q: 'Mikä on Fortnite-pelissä tavoitteena?', a: 2, opts: ['Kerätä eniten kultaa', 'Rakentaa suurin linna', 'Olla viimeinen selviytyjä', 'Voittaa kilpa-ajo'] },
      // --- lisää uusia elokuvat-kysymyksiä tähän (nu-eo-011, nu-eo-012, ...) ---
    ]
  },
  {
    id: 'urheilu',
    name: 'Urheilu',
    emoji: '⚽',
    color: ['rgba(22,163,74,0.12)', 'rgba(22,163,74,0.22)', '#166534'],
    questions: [
      { id: 'nu-ur-001', q: 'Montako pelaajaa on jalkapallojoukkueessa kentällä?', a: 2, opts: ['9', '10', '11', '12'] },
      { id: 'nu-ur-002', q: 'Montako pelaajaa on koripallojoukkueessa kentällä?', a: 1, opts: ['4', '5', '6', '7'] },
      { id: 'nu-ur-003', q: 'Montako pelaajaa on lentopallon joukkueessa kentällä?', a: 1, opts: ['5', '6', '7', '8'] },
      { id: 'nu-ur-004', q: 'Millä englanninkielisellä nimellä tunnetaan sulkapallo?', a: 1, opts: ['Squash', 'Badminton', 'Tennis', 'Pickleball'] },
      { id: 'nu-ur-005', q: 'Missä lajissa pelataan kiekolla jäällä?', a: 1, opts: ['Jalkapallossa', 'Jääkiekossa', 'Sulkapallossa', 'Golfissa'] },
      { id: 'nu-ur-006', q: 'Mikä on yleisurheilun lyhyin olympialaisten juoksumatka?', a: 1, opts: ['60 m', '100 m', '200 m', '400 m'] },
      { id: 'nu-ur-007', q: 'Missä kaupungissa järjestettiin 2024 kesäolympialaiset?', a: 2, opts: ['Lontoossa', 'Tokiossa', 'Pariisissa', 'Los Angelesissa'] },
      { id: 'nu-ur-008', q: 'Montako erää on täyspitkässä jääkiekko-ottelussa?', a: 1, opts: ['2', '3', '4', '5'] },
      { id: 'nu-ur-009', q: 'Mikä maa voitti jalkapallon MM-kultaa 2018?', a: 2, opts: ['Brasilia', 'Kroatia', 'Ranska', 'Belgia'] },
      { id: 'nu-ur-010', q: 'Montako pistettä saa tennisessä palvelun suoraan voittamisesta (ässä)?', a: 0, opts: ['1 piste', 'Ei erityispisteitä', '2 pistettä', '3 pistettä'] },
      // --- lisää uusia urheilu-kysymyksiä tähän (nu-ur-011, nu-ur-012, ...) ---
    ]
  },
  {
    id: 'maantieto',
    name: 'Maantieto',
    emoji: '🗺️',
    color: ['rgba(234,88,12,0.12)', 'rgba(234,88,12,0.22)', '#9a3412'],
    questions: [
      { id: 'nu-ma-001', q: 'Mikä on Suomen pääkaupunki?', a: 2, opts: ['Turku', 'Tampere', 'Helsinki', 'Oulu'] },
      { id: 'nu-ma-002', q: 'Millä mantereella Egypti sijaitsee?', a: 2, opts: ['Euroopassa', 'Aasiassa', 'Afrikassa', 'Australiassa'] },
      { id: 'nu-ma-003', q: 'Missä maassa Eiffel-torni sijaitsee?', a: 3, opts: ['Italiassa', 'Espanjassa', 'Saksassa', 'Ranskassa'] },
      { id: 'nu-ma-004', q: 'Mikä on maailman pienin valtio?', a: 1, opts: ['Monaco', 'Vatikaani', 'San Marino', 'Liechtenstein'] },
      { id: 'nu-ma-005', q: 'Mikä on Suomen naapurimaa idässä?', a: 3, opts: ['Ruotsi', 'Norja', 'Viro', 'Venäjä'] },
      { id: 'nu-ma-006', q: 'Kuinka monta mannerta maailmassa on?', a: 2, opts: ['5', '6', '7', '8'] },
      { id: 'nu-ma-007', q: 'Missä maassa sijaitsee Colosseum?', a: 3, opts: ['Kreikassa', 'Ranskassa', 'Espanjassa', 'Italiassa'] },
      { id: 'nu-ma-008', q: 'Mikä valtameri on Euroopan ja Amerikan välissä?', a: 2, opts: ['Tyyni valtameri', 'Intian valtameri', 'Atlantin valtameri', 'Arktinen'] },
      { id: 'nu-ma-009', q: 'Missä maassa sijaitsee Fuji-vuori?', a: 2, opts: ['Kiinassa', 'Koreassa', 'Japanissa', 'Taiwanissa'] },
      { id: 'nu-ma-010', q: 'Mikä on Pohjoismaiden suurin maa pinta-alaltaan?', a: 2, opts: ['Suomi', 'Norja', 'Ruotsi', 'Tanska'] },
      // --- lisää uusia maantieto-kysymyksiä tähän (nu-ma-011, nu-ma-012, ...) ---
    ]
  },
  {
    id: 'pelit',
    name: 'Pelit & Teknologia',
    emoji: '🎮',
    color: ['rgba(79,70,229,0.12)', 'rgba(79,70,229,0.22)', '#4338ca'],
    questions: [
      { id: 'nu-pe-001', q: 'Mikä suomalainen yritys kehitti Angry Birds -pelin?', a: 2, opts: ['Nokia', 'Supercell', 'Rovio', 'Remedy'] },
      { id: 'nu-pe-002', q: 'Mikä suomalainen yritys kehitti Clash of Clans -pelin?', a: 1, opts: ['Rovio', 'Supercell', 'Nokia', 'Next Games'] },
      { id: 'nu-pe-003', q: 'Montako bittiä on yhdessä tavussa (byte)?', a: 1, opts: ['4', '8', '16', '32'] },
      { id: 'nu-pe-004', q: 'Mitä lyhennettä käytetään tekstiviestistä?', a: 1, opts: ['MMS', 'SMS', 'GPS', 'USB'] },
      { id: 'nu-pe-005', q: 'Mikä on Fortniten kehittäjäyritys?', a: 2, opts: ['Activision', 'EA', 'Epic Games', 'Ubisoft'] },
      { id: 'nu-pe-006', q: 'Missä vuosikymmenellä internet tuli yleiseen käyttöön?', a: 2, opts: ['1970-luvulla', '1980-luvulla', '1990-luvulla', '2000-luvulla'] },
      { id: 'nu-pe-007', q: 'Mikä on maailman myydyin videopelisarja kaikkien aikojen?', a: 2, opts: ['Call of Duty', 'FIFA', 'Mario', 'Pokémon'] },
      { id: 'nu-pe-008', q: 'Missä vuodessa ensimmäinen iPhone julkaistiin?', a: 2, opts: ['2005', '2006', '2007', '2008'] },
      { id: 'nu-pe-009', q: 'Mitä PDF-lyhenne tarkoittaa englanniksi?', a: 1, opts: ['Personal Data File', 'Portable Document Format', 'Public Digital Format', 'Print Data File'] },
      { id: 'nu-pe-010', q: 'Mikä on Roblox-pelissä virtuaalivaluutan nimi?', a: 1, opts: ['V-Bucks', 'Robux', 'Coins', 'Gems'] },
      // --- lisää uusia pelit-kysymyksiä tähän (nu-pe-011, nu-pe-012, ...) ---
    ]
  },
];
