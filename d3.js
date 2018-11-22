// const formatFilter = document.getElementById("formatFilter");
// formatFilter.addEventListener("click", function() {

d3.json("dataset.json")
  .then(data => {
    var booksByYear = d3
      .nest()
      .key(data => Number(data.Year))
      .key(data => data.format)
      // .key(data => data.genre)
      // .key(data => data.genre)
      .rollup(function(v) {
        return {
          // format: v.format,
          formatCount: v.length
          // return v.length;
        };
      })
      .entries(data);

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
  })
  .catch(function(err) {
    throw err;
  });

// });
function formatNumbers(d) {
  // let format = "book";
  let format = document.getElementById("formatFilter").value;
  console.log(format);
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

// TODO
// [] Label your axes
// [] more ticks on the x-axis, per year
// [] research tooltips on the circles

// TODO FOR FORM AND INTERACTION
// [x] maak form element in je html
// [ ] maak alle dragers beschikbaar
// [ ] maak je form zichtbaar met behulp van d3
// [ ] Maak alle dragers zichtbaar in je selectmenu
