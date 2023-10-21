const $ = (sel) => document.querySelector(sel); 
$("#search-bar").addEventListener("keypress", e => {
    if ( e.key == "Enter" ) search();
})

let moreOptionsOpen = false;
$(".more-options-button").addEventListener("click", () => {
    if ( !searchResults ) $(".page-header").style.marginTop = moreOptionsOpen ? "20%" : "10%";
    // $(".more-options").style.padding = moreOptionsOpen ? "0" : "15px";
    $(".more-options").style.height = moreOptionsOpen ? "0px" : "100%";
    // $(".more-options").style.borderWidth = moreOptionsOpen ? "0" : "1px";
    moreOptionsOpen=!moreOptionsOpen;
});

const data = [
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

function generateArticle(title, description, more)
{ 
    return `<div onclick="onArticleClick(event)" class="search-result-element search-result-element-transition">
        <div class="title">${title}</div>
        <div class="description">${description}</div>
        <div class="more">${more}<div>
    </div>`
}

function onArticleClick(e)
{
  if (e.currentTarget.childNodes[5].classList.contains("opened")) {
    e.currentTarget.childNodes[5].classList.remove("opened")
  } else {
    e.currentTarget.childNodes[5].classList.add("opened")
  }
}

let searchResults = false;
function search() 
{
    searchResults = true;
    $(".page-header").style.marginTop = "2%";
    $(".search-result-list").innerHTML = ""
    setTimeout(()=>{
        for ( let i = 0; i<data.length; i++ ) {
            setTimeout(() => {
                let p = document.createElement("div");
                p.innerHTML = generateArticle(data[i].title, data[i].description, data[i].description)
                $(".search-result-list").appendChild(p);
            }
            , 100 * i)
        }
    },300) 
}
