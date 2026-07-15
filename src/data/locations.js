// Tanzania Administrative Hierarchy (Regions -> Districts -> Wards)
// Shared lookup data for HRMS Staff Portal

const TANZANIA_LOCATIONS = [
  {
    id: 1, name: 'Arusha', districts: [
      { id: 101, name: 'Arusha City', wards: ['Baraa','Daraja Mbili','Darakuta','Kati','Kimandolu','Lemara','Levolosi','Moshono','Ngarenaro','Olkokola','Sakina','Sokon I','Sokon II','Terrat','Themi','Unga Ltd'] },
      { id: 102, name: 'Arumeru', wards: ['Bangata','Bwawani','Ilkiroto','Ilkurot','Kimnyaki','Kisongo','Maji ya Chai','Mlangarini','Moshono','Musoshi','Nduruma','Oldonyosambu','Olkojuado','Olorieni','Poli','Seuri','Singisi','Sokon II','Usa River'] },
      { id: 103, name: 'Karatu', wards: ['Baray','Buger','Chambo','Daa','Endamaghan','Endamenguru','Enduiga','Ganako','Kambi ya Simba','Karatu','Kumbiri','Mangola','Mbulumbulu','Qurus'] },
      { id: 104, name: 'Longido', wards: ['Elangata Dapash','Engarenaibor','Engikaret','Gelai Lumbwa','Gelai Meirugoi','Ketumbeine','Kimokouwa','Longido','Matale','Mundarara','Olmolog','Orbomba','Sinya','Tingatinga'] },
      { id: 105, name: 'Monduli', wards: ['Engaruka','Engutoto','Esilalei','Ilkidinga','Lashaine','Lemooti','Lengijave','Makuyuni','Meserani','Mfereji','Monduli Juu','Monduli Mjini','Mswakini','Mto wa Mbu','Selela','Sepeko','Suguro'] },
      { id: 106, name: 'Ngorongoro', wards: ['Alailelai','Arash','Digodigo','Enduleni','Enguserosambu','Kakesio','Lemala','Maalanja','Makarot','Malambo','Misigiyo','Nainokanoka','Naiyobi','Ngoile','Ngorongoro','Olkdo','Olkiramatian','Olmesutie','Olorien','Pinyinyi','Piyaya','Samunge','Soitsambu'] },
    ]
  },
  {
    id: 2, name: 'Dar es Salaam', districts: [
      { id: 201, name: 'Ilala', wards: ['Bonde','Buguruni','Buyuni','Gerezani','Gongolamboto','Ilala','Jangwani','Kariakoo','Kinyerezi','Kipawa','Kisarawe','Kisutu','Kitunda','Kivukoni','Mchafukoge','Mchikichini','Mikocheni','Msongola','Pugu','Segerea','Tabata','Ukonga','Upanga Magharibi','Upanga Mashariki','Vingunguti'] },
      { id: 202, name: 'Kigamboni', wards: ['Kibada','Kigamboni','Kimbiji','Majanji','Mjimwema','Pembamnazi','Somangila','Tungi','Vijibweni'] },
      { id: 203, name: 'Kinondoni', wards: ['Bunju','Kawe','Kigogo','Kijitonyama','Kinondoni','Kunduchi','Mabwepande','Magomeni','Makongo','Makumbusho','Manzese','Mbezi','Mikocheni','Mlimani','Msasani','Mwananyamala','Ndugumbi','Tandale','Ubungo','Wazo'] },
      { id: 204, name: 'Temeke', wards: ['Azimio','Buza','Chamazi','Charambe','Kigamboni','Kijichi','Kilakala','Kimbiji','Kisarawe','Mbagala','Mianzini','Miburani','Mkongwe','Mtoni','Pemba Mnazi','Sandali','Tandika','Temeke','Toangoma','Vijibweni','Yombo Vituka'] },
      { id: 205, name: 'Ubungo', wards: ['Kibangu','Kimara','Korogwe','Kwembe','Makongo','Makuburi','Mburahati','Mpakani','Msewe','Saranga','Sinza','Ubungo','Ufukoni','Ukwamani','Yombo'] },
    ]
  },
  {
    id: 3, name: 'Dodoma', districts: [
      { id: 301, name: 'Bahi', wards: ['Babayu','Bahi','Chali','Chiboli','Chikola','Chipanga','Chumbu','Ibihwa','Ibugule','Kigwe','Lamaiti','Lumuma','Makanda','Mpalanga','Mpamantwa','Mtitaa','Nondwa','Olbutu','Ulelingombe','Zanka'] },
      { id: 302, name: 'Chamwino', wards: ['Buigiri','Chamwino','Chiboli','Chilonwa','Chinugulu','Dabalo','Dodoma Makulu','Handali','Haneti','Huzi','Idifu','Iringa Mvumi','Kikombo','Kinyasi','Kisasa','Kongwa','Majengo','Makangwa','Manchali','Manda','Manganga','Membe','Mlowa','Mpwayungu','Msalato','Mvumi Makulu','Mvumi Mission','Nghambi','Nhinhi','Segala','Zanka'] },
      { id: 303, name: 'Chemba', wards: ['Churuku','Dalai','Farkwa','Goima','Gwandi','Jangalo','Kalema','Kilimani','Kimba','Kinyamsitu','Kwamtoro','Lalta','Makyuni','Mondo','Mpende','Mrijo','Ovada','Paranga','Sanzawa','Sitalike','Songwa','Tumbakose'] },
      { id: 304, name: 'Dodoma', wards: ['Chahwa','Chamwino','Chang ombe','Chemchem','Dodoma Makulu','Hazina','Ipagala','Kikombo','Kilimani','Kisasa','Makulu','Makutupora','Mbabala','Mipipa','Mkonze','Mpunguzi','Msalato','Nala','Nghonghona','Ntyuka','Tambukareli','Tobwe','Zuzu'] },
      { id: 305, name: 'Kondoa', wards: ['Bereko','Bolisa','Bumbuta','Busi','Changaa','Haubi','Hondo','Itaswi','Kikolo','Kikore','Kilimani','Kippera','Kisese','Kolo','Konduchi','Kondoa','Majeleko','Masange','Mnenya','Pahi','Salanka','Serya','Soli','Tinga','Wotta'] },
      { id: 306, name: 'Kongwa', wards: ['Chamkoroma','Chitego','Chikola','Hogoro','Kibaigwa','Kongwa','Makawa','Mofu','Mombesa','Mpalanga','Mpwayungu','Ngawa','Nghumbi','Sagara','Sagawe','Sejeli','Songwa','Ulewe','Zava','Zoge'] },
      { id: 307, name: 'Mpwapwa', wards: ['Berege','Chipogoro','Chitemo','Chunyu','Galigali','Godegode','Gulwe','Ipera','Kibakwe','Kikeo','Kingiti','Kimagai','Lufu','Luhundwa','Lumuma','Makwale','Mang anza','Mbuga','Mlembule','Mpwapwa','Msamalo','Mughanga','Ngambi','Pala','Rudi','Wotta'] },
    ]
  },
  {
    id: 4, name: 'Kilimanjaro', districts: [
      { id: 401, name: 'Hai', wards: ['Bomang ombe','Hai','Kia','Machame Kaskazini','Machame Kusini','Machame Magharibi','Machame Mashariki','Machame Narumu','Machame Uroki','Makoa','Masama','Mengwe','Mwika','Nguni','Njiapanda','Old Moshi Magharibi','Old Moshi Mashariki','Rau','Sanya','Weruweru'] },
      { id: 402, name: 'Moshi', wards: ['Changa','Kibosho Kati','Kibosho Magharibi','Kibosho Mashariki','Kibosho Uru','Kibosho West','Kilema Kaskazini','Kilema Kusini','Kilema Magharibi','Kilema Mashariki','Kirua','Mabogini','Maji ya Chai','Makuyuni','Mamba','Marangu Magharibi','Marangu Mashariki','Mbokomu','Mkuu','Moshi Mjini','Mwika','Nyanga','Old Moshi','Rau','Uswaa','Uru','Uru Kusini','Uru North','Uru Shimbwe','Uru South'] },
      { id: 403, name: 'Mwanga', wards: ['Chomvu','Jipe','Keni','Kileo','Kirongwe','Kisiwani','Kivingo','Korangaje','Kotela','Kwakoa','Kweria','Lembeni','Luwewere','Mandaka','Mgagao','Mlembe','Msangeni','Mwanga','Mwaniko','Nanjara','Ngujini','Parakoi','Shigatini','Uparanga','Vuga','Wery'] },
      { id: 404, name: 'Rombo', wards: ['Aleni','Holili','Keni','Keni Mengwe','Kileo','Kirongo Samanga','Kirua Vunjo','Kisale','Kiwalaka','Komakya','Mahida','Makiidi','Mang o','Mangalla','Mashati','Mengwe','Motamburu','Mrao Keryo','Nanjara','Olele','Parakoi','Rombo','Shimbi','Suji','Teni','Uparanga','Usseri','Vunjo','Wema'] },
      { id: 405, name: 'Same', wards: ['Bendera','Bombo','Bwambo','Chome','Hedaru','Kalemawe','Kangoi','Karanga','Kihurio','Kirangare','Kisangara','Kisiwani','Lugulu','Mabilioni','Maji ya Chai','Makanya','Mshewa','Mogabiri','Mpinji','Mtae','Mwembe','Ndungu','Ngorika','Nyambola','Ruvu','Same','Suji','Vudee','Vunta','Vuje'] },
      { id: 406, name: 'Siha', wards: ['Biriri','Daa','Gararagua','Irisya','Kesat','Livondo','Makiwaru','Mandaki','Masama Rundugai','Mashati','Miembeni','Mowo','Ngarenanyuki','Ng wati','Siha Kaskazini','Siha Kati','Siha Kusini','Sombetini','Umbwe','Uruku','Weruweru'] },
    ]
  },
  {
    id: 5, name: 'Mara', districts: [
      { id: 501, name: 'Bunda', wards: ['Bunda','Bunda Mjini','Chitengule','Guta','Gwimi','Hacha','Halumbe','Iramba','Kasuguti','Kenkombyo','Kibara','Kisorya','Mcharo','Nansimo','Neruma','Nyamhoza','Nyamize','Nyamwage','Nyanshana','Sazira','Wariku'] },
      { id: 502, name: 'Butiama', wards: ['Buhemba','Bukabwa','Bulingi','Busegwa','Buswahili','Butiama','Bwiregi','Chankabuli','Kaiseru','Kukirango','Kyamile','Masaba','Mirwa','Muria','Nyankanga','Nyegina','Sirimba','Tegwana'] },
      { id: 503, name: 'Musoma', wards: ['Buhare','Bweri','Fukafuka','Igunda','Igwamiti','Kakerege','Kamunyonge','Kigera','Kinyanga','Makoko','Misungwi','Mugango','Muhura','Muriba','Musoma','Mwigobero','Mwisenge','Nyaburundi','Nyakaboja','Nyakato','Nyambono','Nyamrandirira','Sengo','Tegeruka'] },
      { id: 504, name: 'Rorya', wards: ['Barbu','Bukima','Bukoli','Bukura','Bweri','Goribe','Ikoma','Kigero','Kiranja','Kisorya','Kogaja','Kunzugu','Mbarika','Mirare','Mogabiri','Muhura','Natala','Nyamagaro','Nyamihanga','Nyamimange','Nyamuma','Nyathoronga','Rabour','Rorya','Tai'] },
      { id: 505, name: 'Serengeti', wards: ['Badamadi','Busawe','Busunga','Dutwa','Geitasamo','Ikoma','Issenye','Kebancheba','Kenkombyo','Kenyamonta','Kisaka','Kisangura','Makundusi','Manchira','Mbalibali','Mbita','Mbogwe','Mihingo','Mogabiri','Mwanza','Natta','Nyambureti','Nyamohonda','Nyanshana','Rungore','Sedeco','Serengeti','Stendi Kuu','Uwanja wa Ndege'] },
      { id: 506, name: 'Tarime', wards: ['Barare','Binagi','Bomani','Bumera','Goribe','Itiryo','Kenyan','Kibasuka','Kirwa','Komaswa','Kuria','Manga','Manga','Matongo','Mbogi','Moke','Natta','Nyang ombe','Nyamwage','Nyamiro','Nyarero','Nyegina','Sabasaba','Sirimba','Susuni','Turwa'] },
    ]
  },
  {
    id: 6, name: 'Mbeya', districts: [
      { id: 601, name: 'Busokelo', wards: ['Bujela','Bulyambwa','Busokelo','Kandete','Kasanga','Kateela','Lema','Lupanga','Luswanga','Masoko','Masaani','Mpunguti','Sange','Shanda'] },
      { id: 602, name: 'Chunya', wards: ['Chalangwa','Chokaa','Chunya','Ifumbo','Kambanga','Kanga','Kapapa','Karema','Kiwira','Lupa','Mafuto','Makongolosi','Mamba','Mbugani','Mtanila','Mtwango','Namkupa','Nkundi','Sangambi'] },
      { id: 603, name: 'Kyela', wards: ['Bogota','Bujonde','Busoka','Ikimba','Ikolo','Ipande','Kajigugu','Kandete','Katumbi','Kyela','Lipingo','Lusungo','Makwale','Matema','Mwaya','Ngana','Ngonga','Nkumbi','Rungwe'] },
      { id: 604, name: 'Mbarali', wards: ['Chimala','Igava','Igurusi','Kongolo','Lubanga','Luhanga','Madibira','Mahongole','Mapogoro','Mbarali','Miyombo','Mwatenga','Rujewa','Ruiwa','Ubaruku','Uyole'] },
      { id: 605, name: 'Mbeya', wards: ['Forest','Ghana','Iduda','Iganjo','Iganzo','Igawilo','Ilemi','Ilomba','Isanga','Isongole','Itende','Iwambi','Iyela','Iyunga','Mabatini','Maendeleo','Majengo','Mbalizi','Mwakibete','Mwanjelwa','Nonde','Nsoho','Ntenje','Sinde','Sisimba','Tembela','Uyole'] },
      { id: 606, name: 'Mbozi', wards: ['Chiluluma','Chiwe','Hamdani','Halali','Hewa','Igamba','Ipinda','Isansa','Isangu','Iselamagazi','Itaka','Itepula','Kamsamba','Mlangali','Msango','Myovizi','Nambinzo','Ndalambo','Nduka','Nyimbili','Rungwe','Shongo','Uyole'] },
      { id: 607, name: 'Rungwe', wards: ['Bagamoyo','Bujela','Bulyaga','Ikama','Ilole','Isongole','Kambala','Kandete','Kisiba','Kisondole','Kiwira','Kyimo','Lufilyo','Lukani','Lupata','Masebe','Mbagala','Mpuguso','Ndebwe','Nkunga','Suma','Wanging ombe'] },
    ]
  },
  {
    id: 7, name: 'Morogoro', districts: [
      { id: 701, name: 'Gairo', wards: ['Chagongwe','Gairo','Itete','Iyogwe','Kibedya','Kibundi','Majengo','Mandwa','Mjalinde','Mlandege','Msinga','NMagengati','Rubeho','Ulaya'] },
      { id: 702, name: 'Kilombero', wards: ['Chisano','Chita','Kibaoni','Kiberege','Kiberege','Kikwale','Kilombero','Kisawasawa','Lipangalala','Mangula','Mangula','Mbasa','Mchombe','Mkula','Mogho','Mwaya','Sanje','Uchindile','Usangwe'] },
      { id: 703, name: 'Kilosa', wards: ['Berega','Chakwale','Chanzige','Dumila','Gwamvaly','Ipera','Kibatu','Kiberege','Kidodi','Kisanga','Kisemu','Lumuma','Lungo','Magole','Magomeni','Makole','Makurugusi','Makutupora','Mamboya','Masanja','Mikumi','Mkimba','Msowero','Ngwere','Rudewa','Rubeho','Ruhembe','Uchindile','Vidunda','Zombo'] },
      { id: 704, name: 'Morogoro', wards: ['Boma','Kihonda','Kilakala','Kingo','Mazimbu','Mbuyuni','Mikocheni','Mji Mkuu','Mji Mpya','Morogoro','Mwembesongo','Sabasaba','Sultan','Uwanja wa Taifa','Viwandani'] },
      { id: 705, name: 'Mvomero', wards: ['Bunduki','Doma','Hembeti','Homboza','Kanga','Kikeo','Kwekita','Langali','Lungo','Makiidi','Mhina','Mlali','Mngazi','Msongozi','Mtibwa','Mvomero','Mzumbe','Sanga','Selenje','Tchenzema','Tumbi','Wami'] },
      { id: 706, name: 'Ulanga', wards: ['Biro','Chirombo','Iragua','Kiberege','Kilosa','Lupiro','Lusoloso','Majengo','Mahenge','Mavimba','Mbuga','Mwaya','Ndangu','Ngewe','Ruaha','Sali','Sifa','Ulanga','Usangu','Vigaeni'] },
      { id: 707, name: 'Malinyi', wards: ['Chemhonda','Kiberege','Lipangalala','Lipangalala','Mahenge','Malinyi','Mavimba','Mbuga','Mwaya','Ruaha','Ulanga','Usangu'] },
    ]
  },
  {
    id: 8, name: 'Mwanza', districts: [
      { id: 801, name: 'Buchosa', wards: ['Bucheke','Busagara','Ibia','Igalula','Kanyama','Kasagara','Kasenyi','Kasungamile','Kijima','Kikulu','Kishinda','Koleri','Lugata','Makoko','Makuja','Nyamize','Nyanga','Nyashimo','Sengelema','Ugogo','Ukerewe','Utare'] },
      { id: 802, name: 'Ilemela', wards: ['Bugogwa','Buswelu','Ilemela','Kirumba','Kiseke','Kitangiri','Meatu','Nyakato','Nyamagana','Nyasubi','Pasiansi','Sangabuye','Sengerema','Sumbawanga','Ugomba'] },
      { id: 803, name: 'Kwimba', wards: ['Bugando','Bukandwe','Bungulwa','Busi','Kafura','Kasamwa','Kisabo','Kisuke','Kongwa','Kwimba','Malya','Mantare','Mbonzoli','Mwabomba','Mwagi','Mwamala','Mwantini','Ngudu','Nzega','Sapiwi','Sumve','Wampembe','Wela'] },
      { id: 804, name: 'Magu', wards: ['Bujinga','Bujumu','Bulela','Bungulwa','Bwashi','Igogo','Jinjimili','Kahangara','Kisesa','Kongolo','Kongolo','Lubugu','Lukoma','Magu','Malya','Mantare','Mbelele','Mbuga','Mgundu','Mwabomba','Mwagi','Mwaniko','Nyanganga','Shishani','Sukuma','Ungu'] },
      { id: 805, name: 'Misungwi', wards: ['Buhingo','Busongo','Busugu','Chabula','Fukafuka','Kijima','Kilosa','Kisabo','Kongwa','Kwangwa','Kwimba','Mabuki','Malya','Mantare','Mbelele','Mbuga','Misungwi','Mwaniko','Mwaru','Nhobora','Sapiwi','Shilalo','Sumve','Ukerewe','Wampembe'] },
      { id: 806, name: 'Nyamagana', wards: ['Buhongwa','Butimba','Fwanza','Igogo','Ihililo','Isamilo','Kishili','Koromije','Luchelele','Luhunguro','Mahina','Majengo','Mkolani','Mwanza','Nyamagana','Nyasaka','Pamba','Pamba','Sangabuye','Tunamkumbi','Uzuri'] },
      { id: 807, name: 'Sengerema', wards: ['Banda','Bbisya','Buyagu','Chifunfu','Kagongwa','Kasenyaga','Kasoge','Katunguru','Kiloleli','Kisabo','Lutamba','Mabuki','Majinja','Maisome','Nyampulukano','Nyatukala','Nyehunge','Sengerema','Songa','Sugu','Talya','Ukerewe','Ungu'] },
      { id: 808, name: 'Ukerewe', wards: ['Bukindo','Bukungu','Bwiro','Bwisya','Kagera','Kagunguli','Kakerege','Mukituntu','Murutunguru','Nansio','Nduruma','Ngoma','Nilema','Nyeje','Ukerewe'] },
    ]
  },
  {
    id: 9, name: 'Zanzibar', districts: [
      { id: 901, name: 'Kaskazini A', wards: ['Bumbwini','Donge','Fujoni','Kikoboga','Kilombero','Kilindi','Kinduni','Kitope','Kiwengwa','Mangapwani','Matemwe','Mbuyu Tende','Mog','Mto wa Pwani','Muwanda','Nungwi','Ole','Pwani Mchangani','Tumbatu'] },
      { id: 902, name: 'Kaskazini B', wards: ['Bumbwini','Donge','Fujoni','Kikoboga','Kilombero','Kilindi','Kinduni','Kitope','Kiwengwa','Mangapwani','Matemwe','Mbuyu Tende','Mog','Mto wa Pwani','Muwanda','Nungwi','Ole','Pwani Mchangani','Tumbatu'] },
      { id: 903, name: 'Kati', wards: ['Bambi','Changaweni','Chuini','Dole','Fukuchani','Kibweni','Kigongoni','Kijiwe','Kikwajuni','Kilie','Kiwengwa','Koani','Machui','Mahonda','Makoba','Mchangani','Mgeni Haji','Mkokotoni','Mkwajuni','Mnyimbi','Mtoko','Muungoni','Mwera','Mwidini','Ngwachani','Pangeni','Unguja Ukuu','Uzi','Zanzibar','Zingwezingwe'] },
      { id: 904, name: 'Kusini', wards: ['Bambi','Bwejuu','Changaweni','Dongwe','Jambiani','Kibuteni','Kigunda','Kijini','Kikadini','Kitogani','Kizimkazi','Makunduchi','Mchangani','Mgeni Haji','Michamvi','Miwani','Muungoni','Ng ambani','Paje','Tundauwa','Unguja Ukuu','Uroa','Uzi'] },
      { id: 905, name: 'Mjini', wards: ['Amaani','Chumbuni','Gulioni','Jang ombe','Karakana','Kiembe Samaki','Kikwajuni','Kilimani','Kisiwani','Kiwalani','Kwahani','Magomeni','Malindi','Makadara','Mlandege','Mpendae','Mwanakwerekwe','Mwembetanga','Nyerere','Shangani','Stonetown','Urusi','Vikokotoni','Welezo'] },
      { id: 906, name: 'Magharibi', wards: ['Bububu','Bweleo','Chuini','Dimani','Fumba','Jangwani','Kanyana','Kiembe Samaki','Kisongoni','Kiwengwa','Makumbi','Manga','Meli','Mfenesini','Mtoni','Mwanakwerekwe','Nungwi','Welezo'] },
    ]
  },
];

export function getRegions() {
  return TANZANIA_LOCATIONS.map(r => ({ id: r.id, name: r.name }));
}

export function getDistricts(regionId) {
  const region = TANZANIA_LOCATIONS.find(r => r.id === regionId || r.name === regionId);
  if (!region) return [];
  return region.districts.map(d => ({ id: d.id, name: d.name }));
}

export function getWards(districtId) {
  for (const region of TANZANIA_LOCATIONS) {
    const district = region.districts.find(d => d.id === districtId || d.name === districtId);
    if (district) return district.wards.map((w, i) => ({ id: `${district.id}-${i}`, name: w }));
  }
  return [];
}

export function getRegionById(id) {
  return TANZANIA_LOCATIONS.find(r => r.id === id);
}
