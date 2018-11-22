// const formatFilter = document.getElementById("formatFilter");
// formatFilter.addEventListener("change", event => {
d3.json("dataset.json")
  .then(data => {
    var booksByYear = d3
      .nest()
      .key(data => Number(data.Year))
      .key(data => data.format)
      .rollup(function(v) {
        return {
          formatCount: v.length
        };
      })
      .entries(data);

    var formats = [...new Set(data.map(x => x.format))];

    let body = d3.select("body");
    let svg = body
      .append("svg")
      .attr("width", 1000)
      .attr("height", 1000);
    let yearCount = booksByYear.map(d => {
      return Number(d.key);
    });
    let bookCount = booksByYear.map(d => {
      return Number(Object.values(d.key));
    });

    let Xscale = d3
      .scaleLinear()
      .range([0, 500])
      .domain([d3.min(yearCount), d3.max(yearCount)]);

    let Yscale = d3
      .scaleLinear()
      .range([0, 500])
      .domain([d3.max(booksByYear, formatNumbers), 0]);

    // welke kant de labels staan
    let x_Axis = d3
      .axisBottom()
      .scale(Xscale)
      .tickFormat(d3.format("d"));
    let y_Axis = d3.axisLeft().scale(Yscale);

    let xAxisGroup = svg
      .append("g")
      .attr("transform", "translate(0, " + 500 + ")")
      .call(x_Axis);
    let yAxisGroup = svg.append("g").call(y_Axis);

    d3.select("form")
      .style("left", "16px")
      .style("top", "16px")
      .attr("id", "formatFilter")
      .append("select")
      .on("change", onChange)
      .selectAll("option")
      .data(formats)
      .enter()
      .append("option")
      .attr("value", d => d)
      .text(d => d);

    svg
      .selectAll("circle")
      .attr("cx", bookCount)
      .attr("cy", yearCount)
      .data(booksByYear)
      .enter()
      .append("circle")
      .attr("r", 5)
      .attr("cx", d => {
        return Xscale(Number(d.key));
      })
      .attr("cy", d => {
        return Yscale(formatNumbers(d));
      });

    function onChange() {
      let field = this.value;
      console.log(field);
      var svg = d3.select("svg");
      var transition = svg.transition();

      // op de y as heb ik hoeveelheden nodig van het specifieke formats
      // op de x as worden de jaren geplot

      // je haalt alle boeken op

      // let newYScale = booksByYear.values.findIndex(x => x.key === field);
      // if (newYScale !== -1) {
      //   return d.values[newYScale].value.formatCount;
      // } else {
      //   return 0;
      // }
      // console.log(newYscale);
      // let formatIndex = d.values.findIndex(x => x.key === format);

      // let Yscale = booksByYear.values.findIndex(x => x.key === field);

      transition
        .selectAll("circle")
        .attr("cx", 400)
        .attr("cy", d => {
          return Yscale(formatNumbers(d));
        });
    }
  })
  .catch(function(err) {
    throw err;
  });
// });
function formatNumbers(d) {
  let format = "book";
  // console.log(format);
  // van titus: werkt dit?
  // let found = d.values.find(x => x.key === format);
  // return found ? found.value.formatCount : 0;
  let formatIndex = d.values.findIndex(x => x.key === format);
  if (formatIndex !== -1) {
    return d.values[formatIndex].value.formatCount;
  } else {
    return 0;
  }
}
