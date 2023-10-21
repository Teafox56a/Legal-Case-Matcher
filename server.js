const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());


// GET request handler
// app.get('/', (req, res) => {
//     res.send('GET /');
// });


app.get('/', (req, res) => {
    axios.get("https://orzeczenia.nsa.gov.pl/cbo/search?wszystkieSlowa=&wystepowanie=gdziekolwiek&odmiana=on&sygnatura=&sad=dowolny&rodzaj=dowolny&symbole=6329&odDaty=&doDaty=&sedziowie=&funkcja=dowolna&takPrawomocne=on&takUzasadnienie=on&rodzaj_organu=&hasla=&akty=&przepisy=&publikacje=&glosy=&submit=Szukaj").then(function (response) {
        // console.log(response);
        // <td class="info-list-value " style="font-size: 12pt; border: none;">[\w\W]*?</td>
        const reTitles = new RegExp(`(?<=<td class="info-list-value " style="font-size: 12pt; border: none;">[\\w\\W]*?<a href=")[\\w\\W]*?(?="[\\w\\W]*?</td>)`, "g");
        table = [... response.data.matchAll(reTitles)];
        table.forEach(title => console.log(`- ${title}`));
    });

    res.send('GET /');
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
