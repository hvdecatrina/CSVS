app.shinyBindings = {};
app.shinyBindings.customAnchor = new Shiny.InputBinding();
$.extend(app.shinyBindings.customAnchor, {
    find: function(scope) {
      return $(scope).find(".shiny-custom-anchor");
    },
    getValue: function(el) {
      return $(el).data("anchorData");
    },
    setValue: function(el, value) {
      $(el).data("anchorData", value)
      $(el).trigger("anchorupdate");
    },
    subscribe: function(el, callback) {
      $(el).on("anchorupdate", callback)
    },
    unsubscribe: function(el) {
      $(el).off("anchorupdate")
    },
    initialize: function(el) {
      el.updateAnchor = function(data) {
        $(this).data("shinyInputBinding").setValue(this, data);
      }    
    }   
 })
Shiny.inputBindings.register(app.shinyBindings.customAnchor);
Shiny.addCustomMessageHandler("updateVisibleMonitors", function(data) {
  app.layerGroups.sites.setVisibleSites(data);
})
Shiny.addCustomMessageHandler("updateCategory", function(data) {
  if(data == 1){
    $("#tip").show();
    $("#warning").hide();
    $("#pieC").hide();
  }else if(data == 0){
    $("#tip").hide();
    $("#warning").show();
    $("#pieC").hide();
  }else if(data != 2){
    $("#tip").hide();
    $(".warning").hide();
    $("#pieC").show()
    app.pieChart(JSON.parse(data),"pieC");
  }
})
Shiny.addCustomMessageHandler("updateDataJson", function(data) {
  app.sampleData = JSON.parse(data);
  app.highData = [];
  app.lowData = [];
  app.safeData = [];
  for(var i = 0 ; i < app.sampleData.length; i++){
    var toxicity = app.sampleData[i].TOXICITY;
    if(_.contains(toxicity,"NA")){
      app.safeData.push(app.sampleData[i])
    }else if(_.contains(toxicity,"高") || _.contains(toxicity,"剧")){
      app.highData.push(app.sampleData[i]);
    }else if(_.contains(toxicity,"中") || _.contains(toxicity,"低")){
      app.lowData.push(app.sampleData[i]);
    }
  };
  $(".totalChart").show();
})
Shiny.addCustomMessageHandler("updatapos", function(data) {
  // app.pos = [];
  // for(var i = 0 ; i < data.length ; i++){
  //   app.pos.push(data[i].replace(/\d{4}/g,""))
  // }
  app.pos = [
    "北京市朝阳区1超市（山水文园店）",
    "北京市东城区2超市（和平新城店）",
    "北京市东城区3超市（法华寺店）",
    "北京市丰台区4超市（玉蜓桥店）",
    "北京市海淀区5超市（四道口店）",
    "北京市西城区6超市（菜百店）",
    "北京市西城区7超市（西单店）",
    "北京市西城区8超市"
  ]
})
