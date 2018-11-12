var width = 500,
    height = 500;

var tooltip = d3.select("#chart")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden");

var svg = d3.select("#chart")
  .append ("svg")
  .attr ("height", height)
  .attr ("width", width)
  .append("g")
  .attr("transform", "translate (0,0)");

var radiusScale = d3.scaleSqrt().domain([15,355]).range([10,80])

// the simulation is a collection of forces about where
//I want  the circles to go and how I want the circles to interact
//Step 1: get them to the middle
//Step 2: don't have them collide and be on top of eachother
var simulation = d3.forceSimulation()
.force("x", d3.forceX(width / 2).strength(0.05))
.force("y", d3.forceY(height / 2).strength(0.05))
.force("collide", d3.forceCollide(function(d){
  return radiusScale(d.sales) + 1;
})) 


d3.queue()
.defer(d3.csv, "january.csv")
.await(ready);

function ready (error, datapoints) {

  // console.log("CSV is ready!!!");

var defs = svg.append("defs");

    defs.selectAll(".category-pattern")
    .data(datapoints)
    .enter().append("pattern")
    .attr("class","category-pattern")
    .attr("id", function(d) {
      return d.name
    })
    .attr("height","100%")
    .attr("width","100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image") 
    .attr("height",1)
    .attr("width",1)
    .attr("preserveAspectRatio","none")
    .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
    .attr("xlink:href",function(d){
      return d.image_path
    });

  var circles = svg.selectAll(".category")
  .data(datapoints)
  .enter().append("circle")
  .attr("class", "category")
  .attr("r", function(d) {
    return radiusScale(d.sales);
  })

  .attr("fill", function(d){
    return "url(#" + d.name + ")"
  })
  .on('click',function(d) {
     console.log(d);
  });


  simulation.nodes(datapoints)
  .on('tick', ticked)

  function ticked() {
    circles
    .attr("cx",function(d){
      return d.x
    })
    .attr("cy",function(d){
      return d.y
    })
    .on("mouseover", function(d){
      //

      d3.select(this)
        .transition()
        .duration(750)
        .attr("r", function(d){
          return radiusScale(d.sales) * 1.5; 
        })

      return tooltip.style("visibility", "visible")
        // .text(d.name +  + d.sales);
        .html(d.name + "<br>" + d.sales);
    })
    .on("mousemove", function(d){
      return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
    })
    .on("mouseout", function(d){

      d3.select(this)
        .transition()
        .duration(750)
        .attr("r", function(d){
          return radiusScale(d.sales); 
        })

      return tooltip.style("visibility", "hidden");
    });





}
  
}

// })();















