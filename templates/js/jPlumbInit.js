  jsPlumb.Defaults.Container= $("#web_layout_fluid_view");
  jsPlumb.Defaults.PaintStyle = { strokeStyle:"#F09E30", lineWidth:2, dashstyle: '3 3', };
  jsPlumb.Defaults.EndpointStyle = { radius:7, fillStyle:"#F09E30" };
  jsPlumb.importDefaults({Connector : [ "Bezier", { curviness:50 } ]});
