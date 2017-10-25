app.initElment = function () {
	$(".main").css({
		"height" : $(window).height()
	});
  $(".map").css({
    "width" : $(".vs").width()-4,
    "height" : $(".vs").height()-4
  });
  $(".leftCtr").css({
    "height" : $(window).height()
  })
}
app.initElment()
$(window).resize(function () {
	app.initElment();
})
$("#pArea").select2({width: "100%", height: "20px;"})
$("#qArea").select2({width: "100%", height: "20px;"})
$("#cArea").select2({width: "100%", height: "20px;"})

app.data = {
  us_bounds: L.latLngBounds([2.86, 73.6], [60.5, 135.0])
};
app.map = L.map("map" , {
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [
          {text: "Full Extent", iconCls: "fa fa-serach-minus", callback: app.zoomOut}  
        ],
        zoomControl: false,
        maxZoom: 13,
        minZoom: 4
      });

app.basemaps = {
        "Gray": L.layerGroup([L.tileLayer('http://{s}.tiles.mapbox.com/v3/jcheng.map-5ebohr46/{z}/{x}/{y}.png')])
      };
app.basemaps.Gray.addTo(app.map)
app.zoomOut = function() {
  app.map.fitBounds(app.data.us_bounds);
}

app.zoomOut()
app.layerGroups = {}
app.layerGroups.aoi = L.featureGroup(null);
app.layerGroups.areaServed = L.featureGroup(null);
app.layerGroups.sites = L.siteGroup({
  aoiLayer: app.layerGroups.aoi
  // onEachSite: function(site) {
  //   po = "<span class = 'popup-text'><h4 class = 'header'>Site Information</h4>"
  //   po = po + "<center><table class = 'popup-table'><tr>"

  //   po = po + "<td>Site ID</td><td>"
  //   for(si in site.properties.key) {
  //     po = po + site.properties.key[si] + "<br />"
  //   }
  //   po = po + "</td></tr>"
  //   po = po + "<tr><td>Street Address</td>"
  //   po = po + "<td>" + site.properties.SITE.slice(4) + "</td></tr>"
  //   site.bindPopup(po, {minWidth: 150});
  // }
})
$.ajax({
  dataType: "json",
  url: "data/sites.geojson",
  scriptCharset: 'utf-8',
  success: function(data) {
    var d = app.layerGroups.sites.addGeoJSON(data)
  }
});
app.layerGroups.sites.on("click",function(e){
  e.layer.setStyle(this.options.styles.click);  
  var sunburst_data = app.dataDeal(e);
  document.getElementById("clickey").updateAnchor(e.layer.properties.key);
  app.d3Chart.init_plot(sunburst_data);
  app.sidebars.Mutipie.toggle();
})
app.sidebars = {
    Mutipie: L.control.sidebar('settings-sb', {position: 'topp', autoPan: false}),
    subPie : L.control.sidebar('subPie', {position: 'topleft', autoPan: false}),
    point : L.control.sidebar('point', {position: 'bottom', autoPan: false}),
    matrixSun : L.control.sidebar('matrixSun', {position: 'bottom', autoPan: false})
}
app.map.addControl(app.sidebars.Mutipie);
app.map.addControl(app.sidebars.subPie);
app.map.addControl(app.sidebars.point);
app.map.addControl(app.sidebars.matrixSun);
L.easyButton("fa-pie-chart", function() {app.sidebars.Mutipie.toggle();}, "Mutipie", app.map);
L.easyButton("fa-dot-circle-o", function() {app.sidebars.subPie.toggle();}, "subPie", app.map);
L.easyButton("fa-bar-chart", function() {app.sidebars.point.toggle();}, "point", app.map);
L.easyButton("fa-th", function() {app.sidebars.matrixSun.toggle();}, "matrixSun", app.map);
// app.toggleSidebars = function(sb) {
//   var sidebars = app.sidebars;
//   for(var x in sidebars) {
//     if(sidebars.hasOwnProperty(x)) {
//       if(x == sb) {
//         sidebars[x].toggle();
//       } 
//     }
//   }
// }
$(".sunburst").css({
  "width" : $(".vs").height() * 0.4 + 10 - 46,
  "height" : $(".vs").height() * 0.4 + 10 - 46
});
$(".plot").css({
  "width" : $(".vs").height() * 0.55 - 7,
  "height" : $(".vs").height() * 0.4 + 10 - 46
});
$(".Pointplot").css({
   "width" : $(".vs").width() - 11,
  "height" : $(".vs").height() * 0.675 - 46
});
$("#matrixSun").css({
  "width" : $(".vs").width(),
  "height" : $(".vs").height() * 0.78
})
$(".matrixSunplot").css({
   "width" : $(".vs").width() - 11
});
app.floaters = {
  legend: $.floater("#legendFloater", {title: "Legend", close: false, width: '320px',  right: '50px', bottom: '50px'})
};
app.floaters.legend.open();
app.draw = {
  polygon: new L.Draw.Polygon(app.map, {allowInterSection: false, showArea: false, drawError: {color: '#b00b00', timeout: 1000}, shapeOptions: {color: '#0033ff', fill: false}}),
  rectangle: new L.Draw.Rectangle(app.map, {shapeOptions: {color: '#0033ff', fill: false}}),
  disable: function() {
    app.draw.polygon.disable();
    app.draw.rectangle.disable();
  }
}
$("#drawPolygon").on('click', function() {
  app.draw.disable();
  app.draw.polygon.enable()
});
$("#drawRectangle").on('click', function() {
  app.draw.disable();
  app.draw.rectangle.enable()
});
$("#cancelDraw").on('click', app.draw.disable);
app.map.on('draw:created', function(e) {
    app.setAOI(e.layer)
    app.layerGroups.areaServed.clearLayers();
});
app.setAOI = function(aoi) {
  app.layerGroups.aoi.clearLayers();
  aoi.addTo(app.layerGroups.aoi);
};
app.layerGroups.sites.on("selectionupdate", function(event) {
  document.getElementById("selectedSites").updateAnchor(event.keys);
});
app.layerGroups.sites.addTo(app.map).bringToFront();
$(".matrix").click(function(){
  app.sidebars.matrixSun.toggle();
  var siteObj = app.layerGroups.sites._layers;
  var selectArray = app.layerGroups.sites.options.selectedSites;
  var matrixData = [];
  for(var i = 0 ; i < selectArray.length ; i++){
    for(var j in siteObj){
      var code = siteObj[j].properties.key[0];
      if(code == selectArray[i]){
        matrixData.push(siteObj[j].properties);
      }
    };
  };
  var w = $(".matrixSunplot").width() / 4;
  var h = ($("#matrixSun").height() - 46) / 2;
  var pdl = (w - 220) / 2;
  var pdt = h - 220;
  var html = $("#sunTPL").html();
  for(var i = 0 ; i < matrixData.length ; i++){ 
    $(html).appendTo(".matrixSunplot");
    $(".info .sun").last().attr("id","sun"+i);
  };
  $(".info").css({
    "width" : w - 2*pdl,
    "height" : h,
    "padding" : 0 + " " + pdl + "px"
  });
  $(".sun").css("height",h - pdt);
  $(".text").css("height",pdt);
  for(var i = 0 ; i < matrixData.length ; i++){
    var thickness = Math.random() * 5 + 8;
    var r = Math.random() * 8 + 20;
    matrixSunData = app.dataDeal(matrixData[i]);
    app.d3Chart.matrixSun_plot("sun" + i,matrixSunData,thickness,r);
    $(".text").eq(i).html(app.pos[i]);
    $("#piebLegend").css("display","table-row");
  }
  var plotID = document.getElementById("sun10");
    console.log(plotID)
})
app.dataDeal = function (e) {
  var dealObj;
  var hColor;
  if(e.hasOwnProperty("layer")){
    dealObj =  e.layer.properties;
    hColor = "#CD0000";
  }else{
    dealObj = e;
    var hv = Math.random()*(0.155) + 0.019;
    if(hv < 0.020){
      hColor = "goldenrod1";
    }else if(hv < 0.040){
      hColor = "darkorange1";
    }else if(hv < 0.060){
      hColor = "orangered";
    }else if(hv < 0.080){
      hColor = "orangered2";
    }else if(hv < 0.100){
      hColor = "red2";
    }else if(hv < 0.120){
      hColor = "red3";
    }else if(hv < 0.140){
      hColor = "red4";
    }else{
      hColor = "brown4";
    }
  };
  var SAFE = ["SAFE",dealObj.SAFE,{},"#32CD32"];
  var CN_OUT = ["CN_OUT",dealObj.JUDGMENT_CN_out,{},"#f58225"];
  var CN_IN = ["CN_IN",dealObj.JUDGMENT_CN_in,{},"#FFFFFF"];
  var EUR_OUT = ["EUR_OUT",dealObj.JUDGMENT_EUR_out,{},"#016b3b"];
  var EUR_IN = ["EUR_IN",dealObj.JUDGMENT_EUR_in,{},"#FFFFFF"];
  var JPN_OUT = ["JPN_OUT",dealObj.JUDGMENT_JPN_out,{},"#028889"];
  var JPN_IN = ["JPN_IN",dealObj.JUDGMENT_JPN_in,{},"#FFFFFF"];
  var USA_OUT = ["USA_OUT",dealObj.JUDGMENT_USA_out,{},"#5b1a74"];
  var USA_IN = ["USA_IN",dealObj.JUDGMENT_USA_in,{},"#FFFFFF"];
  var HK_OUT = ["HK_OUT",dealObj.JUDGMENT_HK_out,{},"#9b216c"];
  var HK_IN = ["HK_IN",dealObj.JUDGMENT_HK_in,{},"#FFFFFF"];
  var CAC_OUT = ["CAC_OUT",dealObj.JUDGMENT_CAC_out,{},"#ff0061"];
  var CAC_IN = ["CAC_IN",dealObj.JUDGMENT_CAC_in,{},"#FFFFFF"];
  var CN = ["CN",dealObj.LOW,{"CN_OUT" : CN_OUT,"CN_IN" : CN_IN}];
  var EUR = ["EUR",dealObj.LOW,{"EUR_OUT" : EUR_OUT,"EUR_IN" : EUR_IN}];
  var JPN = ["JPN",dealObj.LOW,{"JPN_OUT" : JPN_OUT,"JPN_IN" : JPN_IN}];
  var USA = ["USA",dealObj.LOW,{"USA_OUT" : USA_OUT,"USA_IN" : USA_IN}];
  var HK = ["HK",dealObj.LOW,{"HK_OUT" : HK_OUT,"HK_IN" : HK_IN}];
  var CAC = ["CAC",dealObj.LOW,{"CAC_OUT" : CAC_OUT,"CAC_IN" : CAC_IN}];
  var LOW = ["LOW",dealObj.LOW,{"CN" : CN,"EUR" : EUR,"JPN" : JPN,"USA" : USA,"HK" : HK,"CAC" : CAC},"#0000AA"];
  var Border = ["Border",dealObj.LOW,{},"#4b4a48"];
  var SAFE = ["SAFE",dealObj.SAFE,{},"#32CD32"];
  var idx = dealObj.freqRate;
  var obj = {};
  for(var i = idx ; i > 0 ; i--){
    var arry = [];
    arry = ["PART" + i,dealObj.HIGH,obj,hColor];
    obj = {};
    obj["PART" + i] = arry;
  };
  var HIGH = ["HIGH",dealObj.HIGH,obj,"#FF0000"];
  var sunburst_data = ["",dealObj.TOTAL,{"HIGH" : HIGH,"Border" : Border,"LOW" : LOW,"SAFE" : SAFE}];
  return sunburst_data;
}