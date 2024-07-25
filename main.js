let sceneIndex = 0;
const scenes = [
  showScatterplot,
  highlightHighCityMPG,
  highlightMoreEngineCylinders,
];

async function init() {
  data = await d3.csv("https://flunky.github.io/cars2017.csv");

  x = d3.scaleLog().domain([10, 150]).range([0, 400]);
  y = d3.scaleLog().domain([10, 150]).range([400, 0]);

  const svg = d3
    .select("svg")
    .attr("width", 600)
    .attr("height", 600)
    .append("g")
    .attr("transform", "translate(100,100)");

  svg
    .append("g")
    .attr("transform", "translate(0,400)")
    .call(
      d3.axisBottom(x).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s"))
    )
    .append("text")
    .attr("x", 200)
    .attr("y", 40)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Average City MPG");

  svg
    .append("g")
    .call(
      d3.axisLeft(y).tickValues([10, 20, 50, 100]).tickFormat(d3.format("~s"))
    )
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -200)
    .attr("y", -40)
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .text("Average Highway MPG");

  const fuelTypes = Array.from(new Set(data.map((d) => d.Fuel)));
  const dropdown = d3.select("#fuelDropdown");
  dropdown
    .selectAll("option")
    .data(fuelTypes)
    .enter()
    .append("option")
    .attr("value", (d) => d)
    .text((d) => d);

  // Initialize the first scene
  scenes[sceneIndex]();
}

function showScatterplot() {
  clearAnnotations();
  updateTitle("Exploring Car Fuel Efficiency: City vs. Highway MPG");

  d3.select("svg").selectAll("circle").remove();
  const svg = d3.select("g");

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.AverageCityMPG))
    .attr("cy", (d) => y(d.AverageHighwayMPG))
    .attr("r", (d) => Number(d.EngineCylinders) + 4)
    .attr("fill", "lightblue")
    .on("mouseover", function (event, d) {
      // const [xPos, yPos] = d3.pointer(event);
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .html("Make: " + data[d].Make + "<br>Fuel: " + data[d].Fuel)
        .style("position", "absolute")
        .style("left", d3.mouse(this)[0] + 550 + "px")
        .style("top", d3.mouse(this)[1] + 110 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(100).style("opacity", 0);
    });

  const annotations = [
    {
      note: {
        label: "Electric cars have the highest MPG",
        title: "Insight",
      },
      x: 430,
      y: 200,
      dy: 15,
      dx: 15,
    },
    {
      note: {
        label:
          "There is a significant fuel efficiency gap between electric and gas cars",
        title: "Observation",
      },
      x: 320,
      y: 330,
      dy: 15,
      dx: 15,
    },
  ];

  const makeAnnotations = d3.annotation().annotations(annotations);
  d3.select("#example1").append("g").call(makeAnnotations);
}

function highlightHighCityMPG() {
  clearAnnotations();
  const threshold = 50;
  updateTitle("Fuel Efficiency of Different Fuel Types");

  d3.select("#fuelDropdown").style("display", "block").style("margin", "10px");
  d3.select("#fuelDropdownLabel")
    .style("display", "block")
    .style("margin", "10px");

  d3.select("svg").selectAll("circle").remove();
  const svg = d3.select("g");
  const fuelFilter = d3.select("#fuelDropdown").property("value");
  updateFuelFilter(fuelFilter);

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.AverageCityMPG))
    .attr("cy", (d) => y(d.AverageHighwayMPG))
    .attr("r", (d) => Number(d.EngineCylinders) + 4)
    .attr("fill", "lightblue")
    // .attr("fill", (d) =>
    //   d.AverageCityMPG >= threshold ? "orange" : "lightblue"
    // )
    .on("mouseover", function (event, d) {
      // const [xPos, yPos] = d3.pointer(event);
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .html("Make: " + data[d].Make + "<br>Fuel: " + data[d].Fuel)
        .style("position", "absolute")
        .style("left", d3.mouse(this)[0] + 550 + "px")
        .style("top", d3.mouse(this)[1] + 110 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(100).style("opacity", 0);
    });

  const annotations = [
    {
      note: {
        label: "AvgHighwayMPG:82 AvgCityMPG:85",
        title: "Electric Mercedes-Benz",
      },
      x: 430,
      y: 200,
      dy: 15,
      dx: 15,
    },
    {
      note: {
        label: "AvgHighwayMPG:42 AvgCityMPG:35",
        title: "Gasoline Mitsubishi",
      },
      x: 270,
      y: 270,
      dy: -15,
      dx: -15,
    },
    // {
    //   note: {
    //     label:
    //       "There is a significant fuel efficiency gap between electric and gas cars",
    //     // title: "Annotation title",
    //   },
    //   x: 320,
    //   y: 330,
    //   // dy: 15,
    //   // dx: 15,
    // },
  ];

  // Add annotation to the chart
  const makeAnnotations = d3.annotation().annotations(annotations);
  d3.select("#example1").append("g").call(makeAnnotations);

  d3.select("#fuelDropdown").on("change", function () {
    d3.select("svg").selectAll("g.annotation").remove();
    const newFuelFilter = d3.select(this).property("value");
    console.log(newFuelFilter);
    updateFuelFilter(newFuelFilter);

    d3.select("svg").selectAll("circle").remove();
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.AverageCityMPG))
      .attr("cy", (d) => y(d.AverageHighwayMPG))
      .attr("r", (d) => Number(d.EngineCylinders) + 4)
      .attr("fill", "lightblue")
      .attr("visibility", (d) =>
        newFuelFilter == "All"
          ? "visible"
          : d.Fuel == newFuelFilter
          ? "visible"
          : "hidden"
      )
      .on("mouseover", function (event, d) {
        // const [xPos, yPos] = d3.pointer(event);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(
            "Make: " +
              data[d].Make +
              "<br>Fuel: " +
              data[d].Fuel +
              "<br>Engine Cylinders: " +
              data[d].EngineCylinders
          )
          .style("position", "absolute")
          .style("left", d3.mouse(this)[0] + 550 + "px")
          .style("top", d3.mouse(this)[1] + 110 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(100).style("opacity", 0);
      });

    const annotations = [
      {
        note: {
          label: "AvgHighwayMPG:82 AvgCityMPG:85 ",
          title: "Electric Mercedes-Benz",
        },
        x: 430,
        y: 200,
        dy: 15,
        dx: 15,
      },
      {
        note: {
          label: "AvgHighwayMPG:42 AvgCityMPG:35",
          title: "Gasoline Mitsubishi",
        },
        x: 270,
        y: 270,
        dy: -15,
        dx: -15,
      },
      {
        note: {
          label:
            "There is a significant fuel efficiency gap between electric and gas cars",
          // title: "Annotation title",
        },
        x: 320,
        y: 330,
        // dy: 15,
        // dx: 15,
      },
    ];

    // Add annotation to the chart
    const makeAnnotations = d3.annotation().annotations(annotations);
    d3.select("#example1")
      .append("g")
      .call(makeAnnotations)
      .attr(
        "visibility",
        newFuelFilter == "All" || newFuelFilter == NaN ? "visible" : "hidden"
      );

    // svg
    //   .selectAll("circle")
    //   .data(
    //     data.filter(
    //       (d) =>
    //         d.AverageCityMPG >= threshold &&
    //         (newFuelFilter === "All" || d.Fuel === newFuelFilter)
    //     )
    //   )
    //   .join(
    //     (enter) =>
    //       enter
    //         .append("circle")
    //         .attr("cx", (d) => x(d.AverageCityMPG))
    //         .attr("cy", (d) => y(d.AverageHighwayMPG))
    //         .attr("r", (d) => Number(d.EngineCylinders) + 4)
    //         .attr("fill", (d) =>
    //           d.AverageCityMPG >= threshold ? "orange" : "lightblue"
    //         ),
    //     (update) => update,
    //     (exit) => exit.remove()
    //   );
  });
}

function highlightMoreEngineCylinders() {
  clearAnnotations();
  updateTitle("Fuel Efficiency and Engine Cylinders");

  d3.select("svg").selectAll("circle").remove();

  d3.select("#cylinderSlider").style("display", "block");
  d3.select("#sliderLabel").style("display", "block");
  d3.select("#sliderTitle").style("display", "block").style("margin", "10px");

  const slider = d3.select("#cylinderSlider");
  const threshold = +slider.property("value");
  updateSliderLabel(threshold);

  const svg = d3.select("g");
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => x(d.AverageCityMPG))
    .attr("cy", (d) => y(d.AverageHighwayMPG))
    .attr("r", (d) => Number(d.EngineCylinders) + 4)
    .attr("fill", "lightblue")
    .on("mouseover", function (event, d) {
      // const [xPos, yPos] = d3.pointer(event);
      tooltip.transition().duration(100).style("opacity", 1);
      tooltip
        .html(
          "Make: " +
            data[d].Make +
            "<br>Fuel: " +
            data[d].Fuel +
            "<br>Engine Cylinders: " +
            data[d].EngineCylinders
        )
        .style("position", "absolute")
        .style("left", d3.mouse(this)[0] + 550 + "px")
        .style("top", d3.mouse(this)[1] + 110 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(100).style("opacity", 0);
    });

  slider.on("input", function () {
    d3.select("svg").selectAll("g.annotation").remove();
    const newThreshold = +this.value;
    updateSliderLabel(newThreshold);

    d3.select("svg").selectAll("circle").remove();
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(d.AverageCityMPG))
      .attr("cy", (d) => y(d.AverageHighwayMPG))
      .attr("r", (d) => Number(d.EngineCylinders) + 4)
      .attr("fill", "lightblue")
      .attr("visibility", (d) =>
        d.EngineCylinders >= newThreshold ? "visible" : "hidden"
      )
      .on("mouseover", function (event, d) {
        // const [xPos, yPos] = d3.pointer(event);
        tooltip.transition().duration(100).style("opacity", 1);
        tooltip
          .html(
            "Make: " +
              data[d].Make +
              "<br>Fuel: " +
              data[d].Fuel +
              "<br>Engine Cylinders: " +
              data[d].EngineCylinders
          )
          .style("position", "absolute")
          .style("left", d3.mouse(this)[0] + 550 + "px")
          .style("top", d3.mouse(this)[1] + 110 + "px");
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(100).style("opacity", 0);
      });

    const annotations = [
      {
        note: {
          label: "The more cylinders, the lower the fuel efficiency",
          title: "Insight",
        },
        x: 190,
        y: 385,
        dy: -15,
        dx: 15,
      },
    ];

    const makeAnnotations = d3.annotation().annotations(annotations);
    // .attr("visibility", newThreshold >= 8 ? "visible" : "hidden");
    d3.select("#example1")
      .append("g")
      .call(makeAnnotations)
      .attr("visibility", newThreshold >= 8 ? "visible" : "hidden");
  });
}

function updateTitle(title) {
  d3.select("svg").selectAll("text.title").remove();
  d3.select("g")
    .append("text")
    .attr("x", 200)
    .attr("y", -20)
    .attr("text-anchor", "middle")
    .attr("class", "title")
    .style("font-size", "20px")
    .text(title);
}

function clearAnnotations() {
  d3.select("svg").selectAll("g.annotation").remove();
  d3.select("#cylinderSlider").style("display", "None");
  d3.select("#sliderLabel").style("display", "None");
  d3.select("#fuelDropdown").style("display", "None");
  d3.select("#fuelDropdownLabel").style("display", "None");
  d3.select("#sliderTitle").style("display", "None");
  d3.select("#cylinderSlider").property("value", 0);
}

function updateSliderLabel(value) {
  d3.select("#sliderLabel").text(`At least ${value} cylinders`);
}

function updateFuelFilter(value) {
  d3.select("#fuelDropdown").property("value", value);
}

function previousScene() {
  if (sceneIndex > 0) {
    sceneIndex--;
    scenes[sceneIndex]();
  }
}

function nextScene() {
  if (sceneIndex < scenes.length - 1) {
    sceneIndex++;
    scenes[sceneIndex]();
  }
}
