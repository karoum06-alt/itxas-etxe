/* =====================================================================
   ITXAS-ETXE — EDITABLE CONTENT
   Menu, wines and photos live here. Change a price or add a dish here;
   the page rebuilds itself. Prices are numbers in euros.
   g = translations of the dish name: [English, Français, Euskara]
   tags: "spm" = según precio de mercado · "kg" = price per kg · "p2" = for 2 people
   ===================================================================== */
window.ITXAS = window.ITXAS || {};

ITXAS.restaurant = {
  name: "Restaurante Itxas-Etxe",
  street: "Kaia, 1",
  phone2: "+34 943 14 08 82",
  postal: "20808",
  city: "Getaria",
  region: "Gipuzkoa",
  country: "ES",
  phone: "+34 943 14 00 21",
  phoneHref: "+34943140021",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante+Itxas-Etxe+Kaia+Kalea+Getaria",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Restaurante+Itxas-Etxe%2C+Kaia+1%2C+20808+Getaria%2C+Gipuzkoa",
  mapEmbed: "https://www.google.com/maps?q=Restaurante+Itxas-Etxe,+Kaia+1,+20808+Getaria&output=embed",
  /* Add only verified information. Leave empty to hide. */
  hours: null,          /* e.g. { es: "Martes a domingo · 13:00–15:30 · 20:00–22:30", eu: "...", fr: "...", en: "..." } */
  email: "",
  instagram: ""
};

/* Reservation & contact delivery.
   Paste the endpoint of your form service (e.g. Formspree, Web3Forms, or your own server).
   It receives JSON and must email the restaurant and send the guest an auto-reply.
   While empty, the forms do NOT pretend to send: guests are asked to call instead. */
ITXAS.config = {
  reservationEndpoint: "",
  contactEndpoint: ""
};

ITXAS.menu = [
  { id: "entrantes", es: "Entrantes", en: "Starters", fr: "Entrées", eu: "Sarrerak", items: [
    { n: "Anchoas de la villa en salazón", p: 17.50, g: ["Salt-cured anchovies from Getaria", "Anchois de Getaria au sel", "Herriko antxoa gazituak"] },
    { n: "Jamón ibérico", p: 35.00, g: ["Iberian ham", "Jambon ibérique", "Urdaiazpiko iberikoa"] },
    { n: "Pastel de Itxas-Kabra", p: 18.80, g: ["House scorpion-fish pâté", "Pâté de rascasse de la maison", "Etxeko krabarroka pastela"] },
    { n: "Ensalada mixta", p: 11.00, g: ["Mixed salad", "Salade composée", "Entsalada nahasia"] },
    { n: "Ensalada de bonito con escalibada", p: 19.25, g: ["Bonito tuna salad with roasted peppers and vegetables", "Salade de thon blanc et légumes rôtis", "Hegaluze entsalada barazki erreekin"] },
    { n: "Ensalada de frutos de mar", p: 21.50, g: ["Seafood salad", "Salade de fruits de mer", "Itsaskien entsalada"] },
    { n: "Espárragos con mayonesa", p: 16.50, g: ["White asparagus with mayonnaise", "Asperges blanches, mayonnaise", "Zainzuriak maionesarekin"] }
  ]},
  { id: "calientes", es: "Entrantes calientes", en: "Hot starters", fr: "Entrées chaudes", eu: "Sarrera beroak", items: [
    { n: "Sopa de pescado", p: 10.00, g: ["Fish soup", "Soupe de poisson", "Arrain zopa"] },
    { n: "Marmitako", p: 8.80, g: ["Basque tuna and potato stew", "Ragoût basque de thon et pommes de terre", "Hegaluze eta patata eltzekaria"] },
    { n: "Revuelto de anchoas con pimientos del piquillo", p: 19.50, g: ["Scrambled eggs with anchovies and piquillo peppers", "Œufs brouillés aux anchois et piments piquillo", "Antxoa-nahaskia piquillo piperrekin"] },
    { n: "Revuelto de cocochas", p: 24.75, g: ["Scrambled eggs with hake cheeks (kokotxas)", "Œufs brouillés aux kokotxas de merlu", "Kokotxa-nahaskia"] },
    { n: "Pulpo a la parrilla", p: 30.00, g: ["Grilled octopus", "Poulpe grillé", "Olagarroa parrillan"] }
  ]},
  { id: "mariscos", es: "Mariscos", en: "Shellfish", fr: "Fruits de mer", eu: "Itsaskiak", items: [
    { n: "Percebes", p: 35.00, tags: ["spm"], g: ["Goose barnacles", "Pouces-pieds", "Lanpernak"] },
    { n: "Zamburiñas", p: 22.50, g: ["Queen scallops", "Pétoncles", "Zamburiñak (bieira txikiak)"] },
    { n: "Coquinas", p: 22.00, g: ["Wedge clams", "Tellines", "Kokinak"] },
    { n: "Gambas de Huelva a la plancha", p: 26.00, g: ["Griddled Huelva prawns", "Crevettes de Huelva à la plancha", "Huelvako ganbak plantxan"] },
    { n: "Langostinos estilo Itxas-Etxe", p: 28.50, g: ["King prawns, Itxas-Etxe style", "Gambas à la façon Itxas-Etxe", "Otarrainxkak Itxas-Etxe erara"] },
    { n: "Cigalas a la plancha", p: 40.50, g: ["Griddled langoustines", "Langoustines à la plancha", "Zigalak plantxan"] },
    { n: "Txangurro al horno", p: 25.50, g: ["Oven-baked spider crab", "Araignée de mer au four", "Txangurroa labean"] },
    { n: "Almejas en salsa verde", p: 35.00, g: ["Clams in green parsley sauce", "Palourdes en sauce verte", "Txirlak saltsa berdean"] },
    { n: "Vieira gratinada", note: "2 piezas", p: 14.90, g: ["Gratinated scallops · 2 pieces", "Saint-Jacques gratinées · 2 pièces", "Bieira gratinatua · 2 ale"] }
  ]},
  { id: "segundos", es: "Segundos", en: "Main courses", fr: "Plats principaux", eu: "Bigarren platerak", items: [
    { n: "Chipirones en su tinta", p: 25.50, g: ["Baby squid in their own ink", "Chipirons à l'encre", "Txipiroiak bere tintan"] },
    { n: "Chipirones fritos con ali-oli", p: 26.00, g: ["Fried baby squid with aioli", "Chipirons frits, aïoli", "Txipiroi frijituak ali-oliarekin"] },
    { n: "Chipirones a la plancha", p: 27.50, g: ["Griddled baby squid", "Chipirons à la plancha", "Txipiroiak plantxan"] },
    { n: "Chipirón a la parrilla", p: 27.50, g: ["Charcoal-grilled squid", "Chipiron grillé", "Txipiroia parrillan"] },
    { n: "Chipirones encebollados con pimiento verde", p: 28.50, g: ["Baby squid with soft onions and green pepper", "Chipirons aux oignons et poivron vert", "Txipiroiak tipularekin eta piper berdearekin"] },
    { n: "Bacalao a la vizcaína", p: 27.00, g: ["Salt cod in Biscay-style pepper sauce", "Morue à la biscaïenne", "Bakailaoa bizkaitar erara"] },
    { n: "Cocochas en salsa verde", p: 35.00, g: ["Hake cheeks in green sauce", "Kokotxas de merlu en sauce verte", "Kokotxak saltsa berdean"] },
    { n: "Merluza a la vasca", p: 38.50, g: ["Basque-style hake", "Merlu à la basquaise", "Legatza euskal erara"] }
  ]},
  { id: "brasa", es: "Pescados a la brasa", en: "Charcoal-grilled fish", fr: "Poissons à la braise", eu: "Arrainak txingarretan", items: [
    { n: "Sardinas", p: 22.00, g: ["Sardines", "Sardines", "Sardinak"] },
    { n: "Chicharro", p: 55.00, tags: ["spm", "kg"], g: ["Horse mackerel", "Chinchard", "Txitxarroa"] },
    { n: "Besugo", p: 90.00, tags: ["p2", "spm", "kg"], g: ["Red sea bream", "Dorade rose", "Bisigua"] },
    { n: "Rodaballo salvaje", p: 85.00, tags: ["p2", "spm", "kg"], g: ["Wild turbot", "Turbot sauvage", "Erreboilo basatia"] },
    { n: "Cola de merluza", p: 60.00, tags: ["p2", "spm", "kg"], g: ["Hake tail", "Queue de merlu", "Legatz-isatsa"] },
    { n: "Cogote de merluza", p: 60.00, tags: ["p2", "spm", "kg"], g: ["Hake collar (cogote)", "Cogote de merlu", "Legatz-kokotea"] },
    { n: "Rape", p: 65.00, tags: ["p2", "spm", "kg"], g: ["Monkfish", "Lotte", "Zapoa"] },
    { n: "Ventresca de bonito", p: 25.50, g: ["Bonito tuna belly", "Ventrèche de thon blanc", "Hegaluze-sabelkia"] },
    { n: "Bonito a la parrilla encebollado", p: 35.00, g: ["Grilled bonito tuna with soft onions", "Thon blanc grillé aux oignons", "Hegaluzea parrillan, tipularekin"] },
    { n: "Lubina a la parrilla", p: 65.00, tags: ["p2", "spm", "kg"], g: ["Grilled sea bass", "Bar grillé", "Lupia parrillan"] },
    { n: "Dorada a la parrilla", p: 60.00, tags: ["p2", "spm", "kg"], g: ["Grilled gilt-head bream", "Dorade royale grillée", "Urraburua parrillan"] },
    { n: "Lenguado a la parrilla", p: 75.00, tags: ["p2", "spm", "kg"], g: ["Grilled sole", "Sole grillée", "Mihi-arraina parrillan"] },
    { n: "Raya a la parrilla", p: 25.50, g: ["Grilled skate", "Raie grillée", "Arraia parrillan"] }
  ]},
  { id: "carnes", es: "Carnes", en: "Meat", fr: "Viandes", eu: "Haragiak", items: [
    { n: "Chuletillas de cordero", p: 25.50, g: ["Lamb chops", "Côtelettes d'agneau", "Bildots-txuletak"] },
    { n: "Chuleta de buey a la brasa", p: 44.00, tags: ["kg"], g: ["Charcoal-grilled beef rib steak", "Côte de bœuf à la braise", "Idi-txuleta txingarretan"] },
    { n: "Solomillo Boga-Boga, patatas y piquillo", p: 34.50, g: ["Boga-Boga sirloin with potatoes and piquillo peppers", "Filet Boga-Boga, pommes de terre et piquillos", "Boga-Boga solomilloa, patatak eta piquilloak"] },
    { n: "Costilla de ternera", p: 20.00, g: ["Veal rib", "Côte de veau", "Txahal-saihetsa"] }
  ]},
  { id: "suplementos", es: "Suplementos", en: "Extras", fr: "Suppléments", eu: "Gehigarriak", items: [
    { n: "Ración de patatas fritas", p: 11.00, g: ["Portion of chips", "Portion de frites", "Patata frijitu errazioa"] },
    { n: "Pan", p: 1.00, tags: ["pp"], g: ["Bread", "Pain", "Ogia"] }
  ]}
];

ITXAS.wines = [
  { id: "rosados", es: "Rosados", en: "Rosé", fr: "Rosés", eu: "Ardo gorrixkak", items: [
    ["Especial", 12.50], ["Marqués de Cáceres", 18.50], ["Lambrusco", 16.50], ["Gran Feudo Chivite", 21.00], ["Cresta Rosa", 18.00], ["Mateus", 21.50]
  ]},
  { id: "blancos", es: "Blancos", en: "White", fr: "Blancs", eu: "Ardo zuriak", items: [
    ["Especial", 12.50], ["Monopol", 23.50], ["Viña Esmeralda", 23.50], ["Albariño", 22.50], ["Ramón Bilbao", 22.50], ["Blanco Pescador", 18.50], ["Monjardín", 21.50], ["Enate", 21.50], ["Baldiro", 21.50]
  ]},
  { id: "tintos", es: "Tintos", en: "Red", fr: "Rouges", eu: "Ardo beltzak", items: [
    ["Especial", 12.50], ["Viña Salceda", 23.00], ["Beronia", 22.50], ["Campillo Reserva", 35.00], ["Lope de Haro", 15.20], ["Viña Pomal", 28.00], ["Remelluri", 39.50], ["Pierola", 23.50], ["Traslascuestas", 22.50], ["Lindes de Labastida", 33.50], ["Muga", 35.00], ["Campillo Crianza", 28.50], ["Imperial Reserva", 35.92], ["Azpilicueta", 21.50], ["Cune", 21.50], ["Ramón Bilbao", 18.00], ["Conde Valdemar", 22.50], ["Aponte Ribera del Duero Toro", 45.00]
  ]},
  { id: "regionales", es: "Vinos regionales", en: "Regional", fr: "Vins régionaux", eu: "Bertako ardoak", items: [
    ["Sidra", 7.20], ["Txomin Etxaniz", 21.50], ["Txakoli de Getaria", 17.20]
  ]},
  { id: "cavas", es: "Cavas", en: "Cava & Champagne", fr: "Cavas & Champagne", eu: "Kabak eta xanpaina", items: [
    ["Anna Codorníu", 27.00], ["Juvé Camps", 30.50], ["Juvé Camps Reserva Gran Familia", 38.50], ["Moët Chandon", 68.00]
  ]}
];

/* Photos. cat: restaurant · terraza · patrimonio · mar
   g:false = used elsewhere on the page, so it is NOT repeated in the gallery.
   t = caption [es, eu, fr, en] */
ITXAS.photos = [
  { g: false, f: "hero-exterior", cat: "restaurant", w: 1086, h: 1448, t: ["La entrada, en Kaia Kalea", "Sarrera, Kaia kalean", "L'entrée, sur Kaia Kalea", "The entrance on Kaia Kalea"] },
  { f: "dining-room", cat: "restaurant", w: 1122, h: 1402, t: ["El comedor, con su luz cálida", "Jangela, bere argi epelarekin", "La salle, dans sa lumière chaude", "The dining room in its warm light"] },
  { f: "bar", cat: "restaurant", w: 1199, h: 1312, t: ["La barra y sus azulejos azules", "Barra eta bere azulejo urdinak", "Le comptoir et ses azulejos bleus", "The bar and its blue tiles"] },
  { f: "dining-corner", cat: "restaurant", w: 1122, h: 1402, t: ["El rincón del reloj rojo", "Erloju gorriaren txokoa", "Le coin de l'horloge rouge", "The corner of the red clock"] },
  { f: "terrace-stone", cat: "terraza", w: 1086, h: 1448, t: ["Muro de piedra al anochecer", "Harrizko horma ilunabarrean", "Le mur de pierre au crépuscule", "The stone wall at dusk"] },
  { g: false, f: "terrace-arch", cat: "ambiente", w: 1086, h: 1448, t: ["Bajo el arco de piedra", "Harrizko arkupearen azpian", "Sous l'arche de pierre", "Beneath the stone arch"] },
  { g: false, f: "terrace-evening", cat: "costa", w: 1086, h: 1448, t: ["La terraza cubierta, frente al puerto", "Terraza estalia, portuaren aurrean", "La terrasse couverte, face au port", "The covered terrace, facing the harbour"] },
  { f: "arch-corridor", cat: "terraza", w: 1086, h: 1448, t: ["Del arco al muelle", "Arkutik kaira", "De l'arche au quai", "From the arch to the quay"] },
  { f: "table-sunset", cat: "terraza", w: 1086, h: 1448, t: ["Mesa con luz de atardecer", "Mahaia ilunabarreko argiarekin", "Une table à la lumière du soir", "A table in the evening light"] },
  { f: "frame-knots", cat: "patrimonio", w: 1448, h: 1086, t: ["Nudos marineros", "Itsas korapiloak", "Nœuds marins", "Sailors' knots"] },
  { f: "frame-fishing", cat: "patrimonio", w: 1448, h: 1086, t: ["Viejos aparejos de pesca", "Arrantza-tresna zaharrak", "Anciens articles de pêche", "Old fishing tackle"] },
  { f: "frame-trafalgar", cat: "patrimonio", w: 1448, h: 1086, t: ["Grabado: La bataille de Trafalgar", "Grabatua: La bataille de Trafalgar", "Gravure : La bataille de Trafalgar", "Print: La bataille de Trafalgar"] },
  { g: false, f: "frame-elorza", cat: "patrimonio", w: 1122, h: 1402, t: ["Dibujo firmado por Elorza, 1982", "Elorzak sinatutako marrazkia, 1982", "Dessin signé Elorza, 1982", "Drawing signed by Elorza, 1982"] },
  { f: "frame-ships", cat: "patrimonio", w: 1448, h: 1086, t: ["Veleros en nuestras paredes", "Belaontziak gure hormetan", "Voiliers sur nos murs", "Sailing ships on our walls"] },
  { g: false, f: "dish-bonito", cat: "mar", w: 1170, h: 1754, t: ["Ensalada de bonito con escalibada", "Hegaluze entsalada barazki erreekin", "Salade de thon blanc et légumes rôtis", "Bonito salad with roasted peppers"] },
  { g: false, f: "dish-bonito-table", cat: "mar", w: 1211, h: 1299, t: ["Ensalada de bonito con escalibada", "Hegaluze entsalada barazki erreekin", "Salade de thon blanc et légumes rôtis", "Bonito salad with roasted peppers"] },
  { g: false, f: "dish-prawns", cat: "mar", w: 736, h: 1308, t: ["Gambas y langostinos", "Ganbak eta otarrainxkak", "Crevettes et gambas", "Prawns"] },
  { g: false, f: "dish-grilled", cat: "mar", w: 736, h: 736, t: ["Pescado a la parrilla", "Arraina parrillan", "Poisson grillé", "Grilled fish"] },
  { g: false, f: "dish-fish-red", cat: "mar", w: 1152, h: 2048, t: ["Pescado blanco y pimientos asados", "Arrain zuria eta piper erreak", "Poisson blanc et poivrons rôtis", "White fish and roasted peppers"] },
  { g: false, f: "dish-cod-peppers", cat: "mar", w: 720, h: 1280, t: ["Pescado con pimientos", "Arraina piperrekin", "Poisson aux poivrons", "Fish with peppers"] },
  { f: "dish-gambas", cat: "mar", w: 1448, h: 1086, t: ["Gambas a la plancha", "Ganbak plantxan", "Crevettes à la plancha", "Griddled prawns"] },
  { f: "dish-sardinas", cat: "mar", w: 1226, h: 1283, t: ["Sardinas a la brasa", "Sardinak txingarretan", "Sardines à la braise", "Charcoal-grilled sardines"] },
  { f: "dish-terraza", cat: "mar", w: 1483, h: 1061, t: ["Una mesa en la terraza", "Mahai bat terrazan", "Une table en terrasse", "A table on the terrace"] }
];
