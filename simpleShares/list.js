var alphaVantageAPIKey = "01SKIP2HAYO24I5L";

var currentSymbol;
var nasdaqId = 0;
var nasdaq_100 = readTextFile("nasdaq_100.txt");
if (nasdaq_100.length > 0) {
  currentSymbol = nasdaq_100[0];
  changedSymbol = nasdaq_100[0];
}

buildList();

var request = require('request')
setInterval(function() {
  if(changedSymbol != currentSymbol) {
    currentSymbol = changedSymbol;
    changeShareText(changedSymbol);
  }
  var url = "http://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + changedSymbol + "&apikey=" + alphaVantageAPIKey;
  request(url, function(error, response, body) {
    body = JSON.parse(body);
    console.log(body)
    newPrice(body);
  });
}, 2000);

function changeShareText(changedSymbol) {
  var oldStock = document.getElementById("stockName")
  oldStock.innerText = "Current Share Price: " + changedSymbol;
}

var lastPrice;

function newPrice(arr) {
  var history = document.getElementById("priceHistory")
  currentPrice = arr["Realtime Global Securities Quote"]["03. Latest Price"];
  if (lastPrice < currentPrice) {
    var newElText = "▲ ";
    var wrap = document.createElement("span")
    wrap.className = "up";
  }
  else if(lastPrice == currentPrice) {
    var newElText = "— ";
    var wrap = document.createElement("span")
    wrap.className = "noChange";
  }
  else {
    var newElText = "▼ ";
    var wrap = document.createElement("span")
    wrap.className = "down";
  }
  history.appendChild(wrap);
  var textNode = document.createTextNode(newElText);
  wrap.appendChild(textNode);
  var nodeList = history.getElementsByTagName("SPAN").length;
  if (nodeList == 6) {
    history.children[0].remove()
  }
  document.getElementById("price").innerHTML = currentPrice;
  lastPrice = currentPrice;
}

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  var allText;
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
      if(rawFile.readyState === 4)
      {
          if(rawFile.status === 200 || rawFile.status == 0)
          {
              allText = rawFile.responseText;
              allText = allText.split("  ")
              allText = allText.sort()
          }
      }
  }
  rawFile.send(null);
  return allText;
}

function searchFunction() {
  // Declare variables
  var input, filter, ul, li, a, i;
  input = document.getElementById('stockInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("stockUL");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
          li[i].style.display = "";
      } else {
          li[i].style.display = "none";
      }
  }
}

function buildList() {
  if (nasdaq_100.length > 0) {
    var stockList = document.getElementById("stockUL");
    var headerLetters = [];
    for(i = 0; i < nasdaq_100.length; i++) {
      if(!(headerLetters.includes(nasdaq_100[i][0]))) {
        var listHeader = document.createElement("li");
        var hrefHeader = document.createElement("a");
        hrefHeader.innerText = nasdaq_100[i][0].toUpperCase();
        hrefHeader.setAttribute("class", "header");
        hrefHeader.setAttribute("id", "#");

        listHeader.appendChild(hrefHeader);
        stockList.appendChild(listHeader);
        headerLetters.push(nasdaq_100[i][0]);
      }
      var newStock = nasdaq_100[i];
      var listStock = document.createElement("li");
      var hrefStock = document.createElement("a");

      hrefStock.innerText = newStock;
      var clickString = "changeStock(\"" + newStock + "\");";
      hrefStock.setAttribute("id", "nasdaq_" + nasdaqId);

      stockList.addEventListener("click",function(e) {
        // e.target is our targetted element.
        // try doing console.log(e.target.nodeName), it will result LI
        console.log(e.target.id + " was clicked");
        changeStock(e.target.id);
      });

      nasdaqId = nasdaqId + 1;
      listStock.appendChild(hrefStock);
      stockList.appendChild(listStock);
    }
  }
}

function changeStock(currentId) {
  clickedStock = document.getElementById(currentId);
  console.log("Here is the stock object: " + clickedStock);
  if(clickedStock != null && currentId != "#") {
    changedSymbol = clickedStock.innerText;
    changeShareText(changedSymbol);
  }
}
