const $ = (sel) => document.querySelector(sel); 
$("#search-bar").addEventListener("keypress", e => {
    if ( e.key == "Enter" ) search();
})

let moreOptionsOpen = false;
$(".more-options-button").addEventListener("click", () => {
    // if ( !searchResults ) $(".page-header").style.top = moreOptionsOpen ? "20%" : "10%";
    // $(".more-options").style.padding = moreOptionsOpen ? "0" : "15px";
    $(".more-options").style.height = moreOptionsOpen ? "0px" : "100%";
    // $(".more-options").style.borderWidth = moreOptionsOpen ? "0" : "1px";
    moreOptionsOpen=!moreOptionsOpen;
});

let lastPage = 0;
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
  $(".search-result-list").innerHTML += `<div hidden style="width: 1.5rem; height: 1.5rem;" class="spinner-border text-secondary" role="status"></div> `
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
  // if (e.currentTarget.childNodes[5].classList.contains("opened")) {
  //   e.currentTarget.childNodes[5].classList.remove("opened")
  // } else {
  //   e.currentTarget.childNodes[5].classList.add("opened")
  // }
}

lastQueryData = [];

async function fetchQuery(query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy)
{
  // totalItemsCount = 10;
  lastQueryData = [query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy];
  const receivedData = await (fetch(
    `https://www.saos.org.pl/api/search/judgments?pageSize=10&pageNumber=${lastPage}&all=${query}&sortingField=JUDGMENT_DATE&sortingDirection=DESC`
  ).then( e => e.json() ))
  totalItemsCount = receivedData.info.totalResults;
  data = [];
  console.log(receivedData)
  for ( const block of receivedData.items ) {
    let ob = {}
    ob["title"] = block.courtCases.map(e=>e.caseNumber).join("; ")
    ob["description"] = block.textContent
    data.push(ob)
  }
}

async function loadAnotherPage()
{
  lockPageBusy();
  lastPage++;
  await fetchQuery(...lastQueryData);
  displayResults(false);
  popAlert("Załadowano","załadowano dodatkowe orzeczenia", 5000)
}

let searchResults = false;
function search()
{
  lastPage = 0;
  lockPageBusy();
  const query = $("#search-bar").value;
  const sygnatura = $("#sygnatura").value;
  const sad = $("#sad").value;
  const rodzajOrzeczenia = $("#rodzaj-orzeczenia").value;
  const symbolSprawy = $("#symbol-sprawy").value;
  fetchQuery(query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy).then( displayResults );
  // console.log(query, sygnatura, sad, rodzajOrzeczenia, symbolSprawy)
  
}


function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

function generatePaginationButtons(selectedPage, maxSize, range)
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

async function displayResults(clearPrevious=true) 
{
    releasePageBusy()
    searchResults = true;
    if ( clearPrevious ) $(".page-header").style.marginTop = "0%";
    if ( clearPrevious ) $(".search-result-list").innerHTML = ""
    if ( data.length == 0 ) {
      $(".search-result-list").innerHTML = `<div class="no-results"> Nic nie znaleziono... </div>`
    } else {
      for ( let i = 0; i<data.length; i++ ) {
        await setTimeout(
          () => {
              let p = document.createElement("div");
              p.innerHTML = generateArticle(data[i].title, data[i].description, "")
              $(".search-result-list").appendChild(p.firstChild);
          }
          , 200*i)
      }
    }
    
}

function getDocHeight() {
  var D = document;
  return Math.max(
      D.body.scrollHeight, D.documentElement.scrollHeight,
      D.body.offsetHeight, D.documentElement.offsetHeight,
      D.body.clientHeight, D.documentElement.clientHeight
  );
}

let lastScroll = window.scrollY;
addEventListener("scroll", (event) => {
  let delta = window.scrollY - lastScroll;
  lastScroll = window.scrollY ;
  let lastTop = Number($(".page-header").style.top.replace("px", ""));
  let newTop = Math.max( -300, lastTop - delta );
  newTop = Math.min(0, newTop);
  $(".page-header").style.top = `${newTop}px`;

  if ( window.scrollY + window.innerHeight >= getDocHeight()-20 && searchResults ) {
    loadAnotherPage();
  }
});

function popAlert(title, content, lifetime, type="prime")
{
  const el = document.createElement("div");
  el.innerHTML = 
  `
  <div class="alert-${type}">
    <div class="alert-title">${title}</div>
    <div class="alert-content">${content}</div>
  </div>
  `
  const node = el.childNodes[1];
  document.body.appendChild(node);
  setTimeout( () => {
    node.remove();
  }, lifetime )
}