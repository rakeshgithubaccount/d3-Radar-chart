//Practically all this code comes from https://github.com/alangrafu/radar-chart-d3
//I only made some additions and aesthetic adjustments to make the chart look better 
//(of course, that is only my point of view)
//Such as a better placement of the titles at each line end, 
//adding numbers that reflect what each circular level stands for
//Not placing the last level and slight differences in color
//
//For a bit of extra information check the blog about it:
//http://nbremer.blogspot.nl/2013/09/making-d3-radar-chart-look-bit-better.html
var paramList = [{axis:"Email",value:0.29,reverse:"no",min:60,max:-60},
			{axis:"Social Networks",value:0.16,reverse:"no",min:100,max:600},
			{axis:"Internet Banking",value:0.12,reverse:"no  ",min:2,max:12},
            {axis:"News Sportsites",value:0.34,reverse:"no",min:1,max:6},
			{axis:"Search Engine",value:0.28,reverse:"no",min:-50,max:-300}];

/*var paramList = [{axis:"Email",value:0.29,reverse:"no",min:"10",max:"60"},
			{axis:"Social Networks",value:0.16,reverse:"no",min:"100",max:"1000"},
			{axis:"Internet Banking",value:0.12,reverse:"no",min:"100000",max:"500000"},
			{axis:"News Sportsites",value:0.34,reverse:"no",min:"1",max:"100"},
			{axis:"Search Engine",value:0.28,reverse:"no",min:"-1",max:"-10"}];*/
var self = this;
var actualPointYPosition;
var RadarChart = {
  draw: function(id, d, options,paramList){
  var cfg = {
	 radius: 5,
	 w: 600,
	 h: 600,
	 factor: 1,
	 factorLegend: .85,
	 levels: 3,
	 maxValue: 0,
	 radians: 2 * Math.PI,
	 opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 80,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scale.category10()
	};
	
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('%');
	d3.select(id).select("svg").remove();
	
	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;
	
	//Circular segments
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
      
for(var i=0; i<d[0].length;i++){
//for(var i=0; i<1;i++){
      var lineColor;
      var x1 = cfg.w/2,y1 = cfg.h/2;
      var x2 = cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));
      var y2 = cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
   // console.log("x1 == "+x1+' --- x2 === '+x2)
    //console.log("y1=="+y1+'   --- y2 === '+y2)
      var xInterval = (x2 - x1) / (cfg.levels), yInterval = (y2 - y1) / (cfg.levels);
      var xIncreasingAxisvalue = x1,yIncreasingAxisvalue = y1;
      var valueInterval = 0;
      var dataValues = []; 
    
    for(var p=0;p<=cfg.levels;p++){
        dataValues.push((self.paramList[i].min+valueInterval).toFixed(2));            //Actual Values
        valueInterval = valueInterval + ((self.paramList[i].max)-self.paramList[i].min)/(cfg.levels);
    }
    
    (self.paramList[i].reverse === "yes")? j = cfg.levels : j = 0;    
    var condition = (self.paramList[i].reverse === "yes") ?
      function(j){
          return j>=0;
      } :
      function(j){
          return j<=cfg.levels;
      };
    
   
     while(condition(j)){  
     
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
   // alert(self.paramList[i].reverse)
    /*if(j==0){
       // xIncreasingAxisvalue = xIncreasingAxisvalue + xInterval;     
        //yIncreasingAxisvalue = yIncreasingAxisvalue + yInterval;     
      }
    else if(j=== cfg.levels-1){
         //xIncreasingAxisvalue = xIncreasingAxisvalue + xInterval;     
        //yIncreasingAxisvalue = yIncreasingAxisvalue + yInterval;
    }*/
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", xIncreasingAxisvalue)
	   .attr("y", yIncreasingAxisvalue)
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   //.attr("transform", "translate(" + (cfg.w/2-lev    elFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", lineColor)
	   //.text(Format((j+1)*cfg.maxValue/cfg.levels));         
      //.text(Math.round((j)*(self.paramList[i].max-self.paramList[i].min)/cfg.levels));            //Actual Values
     
      .text(dataValues[j]);            //Actual Values
         //valueInterval = valueInterval + Math.round(((self.paramList[i].max)-self.paramList[i].min)/(cfg.levels-1));
        xIncreasingAxisvalue = xIncreasingAxisvalue + xInterval;
        yIncreasingAxisvalue = yIncreasingAxisvalue + yInterval;  
        (self.paramList[i].reverse === "yes")? j-- : j++;
         
	}
 }
	
	series = 0;
//console.log(allAxis)
	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");
  
	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
	//d.forEach(function(){
	 dataValues = [250,187.5, 192.93,231.45, 191.22,330.90, 279.38,290.45, 278.53,240.72];
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 .style("stroke", cfg.color(series))
				    .attr("points", dataValues)
                     .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", cfg.opacityArea)
					 .on('mouseover', function (d){
          					z = "polygon."+d3.select(this).attr("class");
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", 0.1); 
										g.selectAll(z)
										 .transition(200)
										 .style("fill-opacity", .7);
									  })
					 .on('mouseout', function(){
										g.selectAll("polygon")
										 .transition(200)
										 .style("fill-opacity", cfg.opacityArea);
					 });
	//  series++;
//	});
	//series=0;

	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
           var x1 = cfg.w/2,y1 = cfg.h/2;
            var x2 = cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));
            var y2 = cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
		
          //console.log("x1 =  "+x1+"--x2 = "+x2+"---y1 =  "+y1+"--y2 = "+y2)
            var xAxisValue = d3.scale.linear()
            xAxisValue.domain([self.paramList[i].min,self.paramList[i].max]);
            xAxisValue.range([x1,x2]);
            console.log(xAxisValue(j.value)+"----X")
		return xAxisValue(j.value);
		})
		.attr("cy", function(j, i){
            var x1 = cfg.w/2,y1 = cfg.h/2;
            var x2 = cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));
            var y2 = cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));
          
    //      console.log("x1 =  "+x1+"--x2 = "+x2+"---y1 =  "+y1+"--y2 = "+y2)
            var yAxisValue = d3.scale.linear()
            yAxisValue.domain([self.paramList[i].min,self.paramList[i].max]);
            yAxisValue.range([y1,y2]);
                console.log(yAxisValue(j.value)+"----Y")
               //  self.abc(g);
            return yAxisValue(j.value);
           
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		.on('mouseover', function (d){
					newX =  parseFloat(d3.select(this).attr('cx')) - 10;
					newY =  parseFloat(d3.select(this).attr('cy')) - 5;
					
					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(d.value))
						.transition(200)
						.style('opacity', 1);
						
					z = "polygon."+d3.select(this).attr("class");
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", 0.1); 
					g.selectAll(z)
						.transition(200)
						.style("fill-opacity", .7);
				  })
		.on('mouseout', function(){
					tooltip
						.transition(200)
						.style('opacity', 0);
					g.selectAll("polygon")
						.transition(200)
						.style("fill-opacity", cfg.opacityArea);
				  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	  series++;
	});
	//Tooltip
	tooltip = g.append('text')
			   .style('opacity', 0)
			   .style('font-family', 'sans-serif')
			   .style('font-size', '13px');
      
     /* abc = function(g){
         console.log(g+"------- welcome to g")
     } */ 
     
  },
   
};
