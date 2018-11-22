require("dotenv").config();
const fs = require("fs");
const oba_scraper = require("@gijslaarman/oba-scraper");

const client = new oba_scraper({
  publicKey: process.env.PUBLIC_KEY
});

const search = {
  endpoint: "search",
  query: {
    q: "Terrorisme",
    refine: true
  },
  pages: {
    page: 1,
    pagesize: 20,
    maxpages: 1000
  },
  filter: {
    title: `book.titles && book.titles[0].title && book.titles[0].title[0]['_'] ? book.titles[0].title[0]['_'] : null`,
    Year: `book.publication && book.publication[0].year && book.publication[0].year[0]['_'] ? book.publication[0].year[0]['_'] : null`,
    genre: `book.genres && book.genres[0].genre && book.genres[0].genre[0]['_'] ? book.genres[0].genre[0]['_'] : null`,
    format: `book.formats && book.formats[0].format && book.formats[0].format[0]['_'] ? book.formats[0].format[0]['_'] : null`
  }
};

client.getPages(search).then(res => {
  let data = res.data;
  const newArray = data.filter(d => {
    return d.genre && d.format !== null ? d : false;
  });

  return fs.writeFile("dataset.json", JSON.stringify(newArray), "utf8", () => {
    console.log("file written");
  });
});
