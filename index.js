const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate=require('./modules/replaceTemplate')
////////////////////////////////////////// Files ///////////////////////////////////
// Blocking, synchronous way
// const textIn=fs.readFileSync('./txt/input.txt','utf-8')
// console.log(textIn)

// const textOut=`This is what we know about the avocado: ${textIn}.\n Created on:${Date.now()}`
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('File was writen !')

// Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if(err) console.log('Error!')
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, (err) => {
//         console.log('Your file has been written!');
//       });
//     });
//   });
// });
// console.log("Reading...");

//////////////////////////////////////// Server ////////////////////////////////////////

const tempOverview = fs.readFileSync(
  `./templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `./templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`./templates/template-card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const repData = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const outPut = tempOverview.replace("{%PRODUCT_CARDS%}", repData);
    res.end(outPut);
  }
  // product
  else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product=dataObj[query.id]
    const outPut=replaceTemplate(tempProduct,product)
    res.end(outPut);
  }
  // api
  else if (pathname === "/api") {
    // const productData = JSON.parse(data);
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  }
  // not found
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
      name: "jamshid",
    });
    res.end("<h1>This page name not found !</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
