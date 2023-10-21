const $ = (sel) => document.querySelector(sel); 
$("#search-bar").addEventListener("keypress", e => {
    if ( e.key == "Enter" ) search();
})

let moreOptionsOpen = false;
$(".more-options-button").addEventListener("click", () => {
    if ( !searchResults ) $(".page-header").style.top = moreOptionsOpen ? "20%" : "10%";
    // $(".more-options").style.padding = moreOptionsOpen ? "0" : "15px";
    $(".more-options").style.height = moreOptionsOpen ? "0px" : "100%";
    // $(".more-options").style.borderWidth = moreOptionsOpen ? "0" : "1px";
    moreOptionsOpen=!moreOptionsOpen;
});

let totalItemsCount = 0;
let data = [
    {
      "title": "The Science of Quantum Mechanics",
      "description": "Explore the fundamental principles of quantum mechanics and its impact on our understanding of the universe."
    },
    {
      "title": "Artificial Intelligence and Machine Learning",
      "description": "Discover how AI and machine learning are shaping the future of technology and industry."
    },
    {
      "title": "The History of Ancient Rome",
      "description": "A journey through the rise and fall of one of the greatest empires in history, Ancient Rome."
    },
    {
      "title": "Climate Change and Environmental Impact",
      "description": "Learn about the pressing issue of climate change and its consequences for the planet."
    },
    {
      "title": "Exploring the Mysteries of Deep Space",
      "description": "Journey into the cosmos and uncover the mysteries of distant galaxies and black holes."
    },
    {
      "title": "The World of Cryptocurrency and Blockchain",
      "description": "Dive into the world of digital currency and the revolutionary technology of blockchain."
    },
    {
      "title": "The Art of Renaissance Painting",
      "description": "A study of the Renaissance period and the masterpieces of artists like Leonardo da Vinci and Michelangelo."
    },
    {
      "title": "Culinary Delights of Mediterranean Cuisine",
      "description": "Savor the flavors of Mediterranean cuisine and discover its rich culinary traditions."
    },
    {
      "title": "Mindfulness and Stress Reduction",
      "description": "Explore the benefits of mindfulness practices for reducing stress and improving mental well-being."
    },
    {
      "title": "The Impact of 3D Printing on Manufacturing",
      "description": "Learn how 3D printing is revolutionizing the manufacturing industry and its applications."
    }
]

function showArticle()
{
  $(".article-lookup").style.right = "25px";
  $(".page-content").style.width = "47%";
  $(".page-content").style.left = "15px";
  $(".page-header").style.width = "47%";
}

function hideArticle()
{
  $(".article-lookup").style.right = "-50%";
  $(".page-content").style.width = "100%";
  $(".page-content").style.left = "0";
  $(".page-header").style.width = "100%";
}

function generateArticle(title, description, more)
{ 
    return `<div onclick="onArticleClick(event)" class="search-result-element search-result-element-transition">
        <div class="title">${title}</div>
        <div class="description">${description}</div>
        <div class="more">${more}<div>
    </div>`
}

function lockPageBusy()
{
  $("#search-bar").disabled = true;
  $("#search-bar-icon").childNodes[1].hidden = true;
  $("#search-bar-icon").childNodes[3].hidden = false;
  $("#pagination-nav").hidden = true;
}

function releasePageBusy()
{
  $("#search-bar").disabled = false;
  $("#search-bar-icon").childNodes[1].hidden = false;
  $("#search-bar-icon").childNodes[3].hidden = true;
}

function onArticleClick(e)
{
  showArticle();
  if (e.currentTarget.childNodes[5].classList.contains("opened")) {
    e.currentTarget.childNodes[5].classList.remove("opened")
  } else {
    e.currentTarget.childNodes[5].classList.add("opened")
  }
}

async function fetchQuery(query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy)
{
  // const receivedData = await (fetch(
  //   `https://www.saos.org.pl/api/search/judgments?pageSize=10&pageNumber=0&all=${query}&sortingField=JUDGMENT_DATE&sortingDirection=DESC`
  // ).then( e => e.json() ))
  const receivedData = dummyData;
  totalItemsCount = receivedData.info.totalResults;
  data = [];
  console.log(receivedData)
  for ( const block of receivedData.items ) {
    data.push(block)
  }
}

let searchResults = false;
function search()
{
  lockPageBusy();
  const query = $("#search-bar").value;
  const sygnatura = $("#sygnatura").value;
  const sad = $("#sad").value;
  const rodzajOrzeczenia = $("#rodzaj-orzeczenia").value;
  const symbolSprawy = $("#symbol-sprawy").value;
  fetchQuery(query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy).then( displayResults );
  // console.log(query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy)
  
}

let selectedPage = 1;

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function generatePaddingButtons(selectedPage, maxSize, range)
{
  // const allPages = [...(new Array(maxSize))].map((_,i)=>i+1);
  let res = []
  for ( let i = 0; i<=5; i++ ) {
    if ( selectedPage + i > maxSize ) continue; 
    res.push(selectedPage + i);
  }
  for ( let i = 1; i<range-res.length; i++ ) {
    if ( selectedPage - i < 1 ) continue;
    res.push(selectedPage - i)
  } 
  res.push(1);
  res.push(maxSize);
  res = res.sort((a,b)=>a-b);
  res = res.filter(onlyUnique)
  return res;
}

async function displayResults() 
{
    releasePageBusy()
    searchResults = true;
    $(".page-header").style.marginTop = "0%";
    $(".search-result-list").innerHTML = ""
    if ( data.length == 0 ) {
      $(".search-result-list").innerHTML = `<div class="no-results"> Nic nie znaleziono... </div>`
    } else {
      for ( let i = 0; i < data.length; i++ ) {
        await setTimeout(() => {
              let p = document.createElement("div");
              p.innerHTML = generateArticle(data[i].courtCases.map(e=>e.caseNumber).join("; "), data[i].textContent, "")
              $(".search-result-list").appendChild(p.firstChild);
          }
          , 200)
      }
      setTimeout( () => { 
        $("#pagination-nav .pagination").innerHTML = "";
        $("#pagination-nav .pagination").innerHTML += 
        `<li class="page-item"><a class="page-link" href="#">1</a></li>`
        for ( let i = 1; i<8; i++ ) {
          $("#pagination-nav .pagination").innerHTML += 
          `<li class="page-item"><a class="page-link" href="#">${selectedPage+i}</a></li>`
        }
        $("#pagination-nav .pagination").innerHTML += 
        `<li class="page-item"><a class="page-link" href="#">${Math.floor(totalItemsCount/10)+1}</a></li>`


        $("#pagination-nav").hidden = false;
      }, 1000 );
    }
    
}

let lastScroll = window.scrollY;
addEventListener("scroll", (event) => {
  let delta = window.scrollY - lastScroll;
  lastScroll = window.scrollY ;
  let lastTop = Number($(".page-header").style.top.replace("px", ""));
  let newTop = Math.max( -300, lastTop - delta );
  newTop = Math.min(0, newTop);
  $(".page-header").style.top = `${newTop}px`;
});




dummyData = {
  "links": [
      {
          "rel": "self",
          "href": "https://www.saos.org.pl/api/search/judgments?pageSize=10&pageNumber=0&all=%C5%BCona&sortingField=JUDGMENT_DATE&sortingDirection=DESC"
      },
      {
          "rel": "next",
          "href": "https://www.saos.org.pl/api/search/judgments?pageSize=10&pageNumber=1&all=%C5%BCona&sortingField=JUDGMENT_DATE&sortingDirection=DESC"
      }
  ],
  "items": [
      {
          "id": 31345,
          "href": "https://www.saos.org.pl/api/judgments/31345",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "I ACa 772/13"
              }
          ],
          "judgmentType": "SENTENCE",
          "judges": [
              {
                  "name": "Małgorzata Stanek Sędziowiehanna Rojewska",
                  "function": null,
                  "specialRoles": [
                      "PRESIDING_JUDGE"
                  ]
              },
              {
                  "name": "Wiesława Kuberska",
                  "function": null,
                  "specialRoles": []
              }
          ],
          "textContent": " finansowe zdecydowały, że uroczystości odbyły się. Obecnie P. S. mieszka wraz z <em>żoną</em> i synem w swoim domu rodzinnym. J. S. od dwudziestu lat pozostaje w związku małżeńskim, ma dwoje dzieci: dwudziestoletniego ...  się od śmierci matki. Odwiedza z <em>żoną</em> i synem rodzinę. J. S. po śmierci matki także nie korzystał z pomocy psychologa, ani psychiatry, nie zażywał środków uspokajających. Przez około pół roku miał problemy ze snem ...  się szanująca. Z zebranego materiału dowodowego, bezspornie wynika jednak, że J. S. na kilka lat przed śmiercią swojej matki założył własną rodzinę, miał już dwoje dzieci i <em>żonę</em>, a rodziców jedynie odwiedzał ... , nie są już tak silne jak wówczas, gdy razem prowadzi się jedno gospodarstwo domowe. Co ważne powód ma <em>żonę</em> i dwoje dzieci, które stanowią dla niego wsparcie i pomoc w życiu codziennym, co w pewnej mierze osłabia stratę",
          "keywords": [
              "dobra osobiste",
              "zadośćuczynienie"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/993",
              "id": 993,
              "name": "I Wydział Cywilny",
              "code": "0000503",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/154",
                  "id": 154,
                  "code": "15250000",
                  "name": "Sąd Apelacyjny w Łodzi"
              }
          },
          "judgmentDate": "3013-12-04"
      },
      {
          "id": 227221,
          "href": "https://www.saos.org.pl/api/judgments/227221",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "II K 84/16"
              }
          ],
          "judgmentType": "SENTENCE",
          "judges": [
              {
                  "name": "Joanna Becińska",
                  "function": null,
                  "specialRoles": [
                      "PRESIDING_JUDGE"
                  ]
              }
          ],
          "textContent": ". Jego miesięczne zarobki wynoszą około 1000 zł. Oskarżony oświadczył, że jest właścicielem dwóch samochodów osobowych V. (...) oraz V. (...). Oskarżony pozostaje w związku małżeńskim. <em>Żona</em> posiada prawo jazdy",
          "keywords": [
              "środki karne"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/529",
              "id": 529,
              "name": "II Wydział Karny",
              "code": "0001006",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/84",
                  "id": 84,
                  "code": "15102520",
                  "name": "Sąd Rejonowy w Toruniu"
              }
          },
          "judgmentDate": "2101-04-14"
      },
      {
          "id": 484393,
          "href": "https://www.saos.org.pl/api/judgments/484393",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "IV Ka 810/22"
              }
          ],
          "judgmentType": "REASONS",
          "judges": [],
          "textContent": ". K. – bo jest możliwym, iż pomimo przyjazdu <em>żony</em> pod salę, to jednak oskarżony kierował autem bo: z remizy do domu było bardzo niedaleko, a stan nietrzeźwości nie wykluczał fizycznej możliwości ...  na porę nocną, na odczytanie numerów rejestracyjnych; - oskarżony dzwonił do <em>żony</em> jeszcze będąc w radiowozie, a <em>żona</em> odbierając męża z komisariatu nie powiedziała, że oskarżony „się doigrał” (o których ...  jest jakiegokolwiek powodu, dla którego należy dać wiarę zeznaniom policjantów, bo te są niespójne i nieszczegółowe (niepełne). Istotnie, sąd odwoławczy zważył, że wersję oskarżonego wspierały zeznania jego <em>żony</em>, a ...  oczekiwanych zachowań po stronie zatrzymywanego – pozwalały, w kontekście art. 7 kpk wywieść jednoznaczny wniosek, iż wyjaśnieniom oskarżonego i zeznaniom jego <em>żony</em> nie sposób jest dać wiarę. W sprawie mamy",
          "keywords": [
              "swobodna ocena dowodów"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1083",
              "id": 1083,
              "name": "IV Wydział Karny Odwoławczy",
              "code": "0002006",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/167",
                  "id": 167,
                  "code": "15251500",
                  "name": "Sąd Okręgowy w Piotrkowie Trybunalskim"
              }
          },
          "judgmentDate": "2023-12-30"
      },
      {
          "id": 484395,
          "href": "https://www.saos.org.pl/api/judgments/484395",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "IV Ka 812/22"
              }
          ],
          "judgmentType": "REASONS",
          "judges": [],
          "textContent": ", mający świadomość konieczności łożenia na utrzymanie swojego dziecka. Poprzez pryzmat własnego wykształcenia oraz doświadczeń z <em>żoną</em> (aktualnie byłą), wyjątkowo nawet pewną świadomość sprawy sądowej i ...  dniu 18 kwietnia 2019r., na którym wydano postanowienie o zabezpieczeniu powództwa – zgodnie z prawem został jednak o owym posiedzeniu zawiadomiony na ostatni wiadomy dla <em>żony</em> (...) adres (w sprawie ...  <em>żony</em>, że nie będzie ona w procesie rozwodowym dochodziła alimentów na siebie samą, w żaden sposób nie ekskulpuje oskarżonego. Potwierdza jedynie jakieś „przeliczenia” po stronie A. S. i podejmowanie ...  <em>żony</em>). Kwoty objęte egzekucjami komorniczymi prowadzonymi przeciwko oskarżonemu, to wysokie zaległości powstałe dużo wcześniej, w których istnieniu oskarżony przecież wiedział. Oskarżony, jako osoba",
          "keywords": [
              "swobodna ocena dowodów",
              "warunkowe umorzenie postępowania"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1083",
              "id": 1083,
              "name": "IV Wydział Karny Odwoławczy",
              "code": "0002006",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/167",
                  "id": 167,
                  "code": "15251500",
                  "name": "Sąd Okręgowy w Piotrkowie Trybunalskim"
              }
          },
          "judgmentDate": "2023-12-30"
      },
      {
          "id": 484372,
          "href": "https://www.saos.org.pl/api/judgments/484372",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "IV Ka 732/22"
              }
          ],
          "judgmentType": "REASONS",
          "judges": [],
          "textContent": " oskarżonego, jego <em>żony</em> ), nie uzasadniają i nie usprawiedliwiają dopuszczenia się zachowań, które do podobnych następstw mogą doprowadzić innych ludzi. Nie trzeba przypominać i wyjaśniać, jakie cierpienia i",
          "keywords": [
              "bezwzględny powód odwoławczy"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1083",
              "id": 1083,
              "name": "IV Wydział Karny Odwoławczy",
              "code": "0002006",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/167",
                  "id": 167,
                  "code": "15251500",
                  "name": "Sąd Okręgowy w Piotrkowie Trybunalskim"
              }
          },
          "judgmentDate": "2023-12-22"
      },
      {
          "id": 493137,
          "href": "https://www.saos.org.pl/api/judgments/493137",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "IX U 650/22"
              }
          ],
          "judgmentType": "REGULATION",
          "judges": [],
          "textContent": "sygn. akt IX U 650/22 UZASADNIENIE Orzeczeniem z dnia 29 sierpnia 2022 r., znak (...).<em>ZON</em>.441.1-686.2022, (...) do Spraw Orzekania o Niepełnosprawności w G. zaliczył E. D. do umiarkowanego stopnia niepełnosprawności na stałe, z symbolem niepełnosprawności 06-E. Na skutek odwołania wnioskodawczyni Wojewódzki Zespół do Spraw Orzekania o Niepełnosprawności w S., w dniu 9 listopada 2022 r. utrzymał w mocy to orzeczenie. Organ nie stwierdził niezdolności badanej do samodzielnej egzystencji, a w konsekwencji aby była całkowicie zależna od otoczenia i wymagała konieczności opieki. E. D. wniosła odwołanie od wskazanego orzeczenia, domagając się uznania jej trwałej niepełnosprawności w stopniu znacznym. Argumentowała, że jej stan zdrowia po trzech udarach mózgowych, zaburzenia orientacji i pamięci wraz z szeregiem",
          "keywords": [],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1668",
              "id": 1668,
              "name": "IX Wydział Pracy i Ubezpieczeń Społecznych",
              "code": "0004521",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/272",
                  "id": 272,
                  "code": "15551530",
                  "name": "Sąd Rejonowy Szczecin-Centrum w Szczecinie"
              }
          },
          "judgmentDate": "2023-09-05"
      },
      {
          "id": 493071,
          "href": "https://www.saos.org.pl/api/judgments/493071",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "II Ca 785/23"
              }
          ],
          "judgmentType": "REGULATION",
          "judges": [
              {
                  "name": "Hubert Wicik Sławomir Buras Rafał Adamczyk",
                  "function": null,
                  "specialRoles": []
              }
          ],
          "textContent": " wiedzy co do przebiegu urządzeń kanalizacyjnych na spornej nieruchomości. Tym bardziej jego <em>żona</em> – wnioskodawczyni L. G., która w żaden sposób się na tym nie znała i nie interesowała się tym. Małżonek",
          "keywords": [
              "służebność",
              "zasiedzenie"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/821",
              "id": 821,
              "name": "II Wydział Cywilny Odwołaczy",
              "code": "0001003",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/124",
                  "id": 124,
                  "code": "15200500",
                  "name": "Sąd Okręgowy w Kielcach"
              }
          },
          "judgmentDate": "2023-07-27"
      },
      {
          "id": 491566,
          "href": "https://www.saos.org.pl/api/judgments/491566",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "II Ka 288/23"
              }
          ],
          "judgmentType": "SENTENCE",
          "judges": [
              {
                  "name": "Karol Troć",
                  "function": null,
                  "specialRoles": [
                      "PRESIDING_JUDGE"
                  ]
              }
          ],
          "textContent": " zeznań świadka M. M. (1) (<em>żony</em> oskarżonego obecnej na rozprawie w dniu 13 lutego 2023 roku) na okoliczność przyczyn, dla których oskarżony w dniu 9 października 2022 roku zdecydował się na kierowanie ...  rzeczywiście świadek D. B. potwierdził, że oskarżony jechał z <em>żoną</em> i dwójką dzieci, a do jego zatrzymania doszło na trasie między ich miejscem zamieszania a szpitalem w Ł.. Faktycznie nie mając dowodów przeciwnych imając wątpliwości co do prawdziwości wyjaśnień, a mając możliwość przesłuchania obecnej na Sali rozpraw <em>żony</em> oskarżonego, Sąd winien z takiej możliwości dążenia do ustalenia prawdy (bez uszczerbku ...  wyłącznie dnia poprzedniego i sądził, że jest już trzeźwy. <em>Żona</em> oskarżonego podała zaś, że mąż pił alkohol dnia poprzedniego, tylko jakieś piwo. Tezy te pozostają więc niespójne, chyba że oskarżony wypił",
          "keywords": [],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1277",
              "id": 1277,
              "name": "II Wydział Karny",
              "code": "0001006",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/202",
                  "id": 202,
                  "code": "15301500",
                  "name": "Sąd Okręgowy w Siedlcach"
              }
          },
          "judgmentDate": "2023-07-21"
      },
      {
          "id": 491978,
          "href": "https://www.saos.org.pl/api/judgments/491978",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "VIII U 362/23"
              }
          ],
          "judgmentType": "REASONS",
          "judges": [
              {
                  "name": "Jacek Chrostek",
                  "function": null,
                  "specialRoles": [
                      "PRESIDING_JUDGE"
                  ]
              }
          ],
          "textContent": " nie pracuje od 2012 roku, pozostaje na utrzymaniu <em>żony</em>. W dniu 6.04.2022 roku przebył operację odbarczenia struktur nerwowych kanału kręgowego, usunięcia uszkodzonego krążka L4/L5 oraz wykonania spondylodezy L4",
          "keywords": [
              "świadczenia emerytalno-rentowe"
          ],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1023",
              "id": 1023,
              "name": "VIII Wydział Pracy i Ubezpieczeń Społecznych",
              "code": "0004021",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/159",
                  "id": 159,
                  "code": "15251000",
                  "name": "Sąd Okręgowy w Łodzi"
              }
          },
          "judgmentDate": "2023-07-20"
      },
      {
          "id": 492005,
          "href": "https://www.saos.org.pl/api/judgments/492005",
          "courtType": "COMMON",
          "courtCases": [
              {
                  "caseNumber": "I ACa 137/23"
              }
          ],
          "judgmentType": "SENTENCE",
          "judges": [
              {
                  "name": "Ewa Bazelan",
                  "function": null,
                  "specialRoles": []
              },
              {
                  "name": "Jerzy Nawrocki",
                  "function": null,
                  "specialRoles": [
                      "PRESIDING_JUDGE"
                  ]
              },
              {
                  "name": "Krzysztof Niezgoda",
                  "function": null,
                  "specialRoles": []
              }
          ],
          "textContent": ", woził ją do domu opieki w P., w którym przebywała jej matka oraz do miejscowości rodzinnej jej zmarłego męża. W 2016 roku pozwany bez wiedzy <em>żony</em> udzielił powódce krótkoterminowej pożyczki w kwocie 40 ...  nią dysponować. Już przy zwrocie ww. środków powódka informowała pozwanego i jego <em>żonę</em> o tym, iż zamierza darować im kwotę 60 000,00 zł. Pozwany konsekwentnie odmawiał przyjęcia tych pieniędzy, jednak w czasie jednej z rozmów, powódka po dłuższych pertraktacjach stwierdziła, iż jeśli pozwany i jego <em>żona</em> odmówią przyjęcia pieniędzy, to przekaże je ona na rzecz ich dzieci, co przekonało pozwanego i jego <em>żonę</em> ...  spłaty kredytu hipotecznego zaciągniętego na zakup mieszkania, w którym mieszka rodzina pozwanego. W czasie wpłaty ww. środków w Banku obecna była również powódka. Mimo propozycji pozwanego i jego <em>żony</em>, by",
          "keywords": [],
          "division": {
              "href": "https://www.saos.org.pl/api/ccDivisions/1179",
              "id": 1179,
              "name": "I Wydział Cywilny",
              "code": "0000503",
              "court": {
                  "href": "https://www.saos.org.pl/api/commonCourts/186",
                  "id": 186,
                  "code": "15300000",
                  "name": "Sąd Apelacyjny w Lublinie"
              }
          },
          "judgmentDate": "2023-07-19"
      }
  ],
  "queryTemplate": {
      "pageNumber": {
          "value": 0,
          "description": "Represents current page number",
          "allowedValues": "Not negative integer"
      },
      "pageSize": {
          "value": 10,
          "description": "Represents maximum number of items on the page",
          "allowedValues": "Any integer greater or equal to 1 and less or equal to 100"
      },
      "sortingField": {
          "value": "JUDGMENT_DATE",
          "description": "Represents the field by which you want to sort a list of items",
          "allowedValues": [
              "DATABASE_ID",
              "JUDGMENT_DATE",
              "REFERENCING_JUDGMENTS_COUNT",
              "MAXIMUM_MONEY_AMOUNT",
              "CC_COURT_TYPE",
              "CC_COURT_ID",
              "CC_COURT_CODE",
              "CC_COURT_NAME",
              "CC_COURT_DIVISION_ID",
              "CC_COURT_DIVISION_CODE",
              "CC_COURT_DIVISION_NAME",
              "SC_JUDGMENT_FORM_ID",
              "SC_PERSONNEL_TYPE",
              "SC_COURT_DIVISION_ID",
              "SC_COURT_DIVISION_NAME",
              "SC_COURT_DIVISIONS_CHAMBER_ID",
              "SC_COURT_DIVISIONS_CHAMBER_NAME"
          ]
      },
      "sortingDirection": {
          "value": "DESC",
          "description": "Represents the direction in which to sort a list of items",
          "allowedValues": [
              "ASC",
              "DESC"
          ]
      },
      "all": "żona",
      "legalBase": null,
      "referencedRegulation": null,
      "lawJournalEntryCode": {
          "value": null,
          "description": "Represents polish law journal entry (pl. pozycja dziennika ustaw)",
          "allowedValues": "String in format : 'year/entry_number'"
      },
      "judgeName": null,
      "caseNumber": null,
      "courtType": {
          "value": null,
          "description": "Represents judgment's court type",
          "allowedValues": [
              "COMMON",
              "SUPREME",
              "CONSTITUTIONAL_TRIBUNAL",
              "NATIONAL_APPEAL_CHAMBER",
              "ADMINISTRATIVE"
          ]
      },
      "ccCourtType": {
          "value": null,
          "description": "Represents common court type",
          "allowedValues": [
              "APPEAL",
              "REGIONAL",
              "DISTRICT"
          ]
      },
      "ccCourtId": null,
      "ccCourtCode": null,
      "ccCourtName": null,
      "ccDivisionId": null,
      "ccDivisionCode": null,
      "ccDivisionName": null,
      "ccIncludeDependentCourtJudgments": null,
      "scPersonnelType": {
          "value": null,
          "description": "Represents supreme court judgment's personnel type",
          "allowedValues": [
              "ONE_PERSON",
              "THREE_PERSON",
              "FIVE_PERSON",
              "SEVEN_PERSON",
              "ALL_COURT",
              "ALL_CHAMBER",
              "JOINED_CHAMBERS"
          ]
      },
      "scJudgmentForm": null,
      "scChamberId": null,
      "scChamberName": null,
      "scDivisionId": null,
      "scDivisionName": null,
      "judgmentTypes": {
          "value": [],
          "description": "Represents list of judgments types",
          "allowedValues": [
              "DECISION",
              "RESOLUTION",
              "SENTENCE",
              "REGULATION",
              "REASONS"
          ]
      },
      "keywords": [],
      "judgmentDateFrom": {
          "value": "",
          "description": "Represents the earliest allowed judgment's date on the list of items",
          "allowedValues": "Date in format : 'yyyy-MM-dd'"
      },
      "judgmentDateTo": {
          "value": "",
          "description": "Represents the latest of allowed judgment's date on the list of items",
          "allowedValues": "Date in format : 'yyyy-MM-dd'"
      }
  },
  "info": {
      "totalResults": 48371
  }
}