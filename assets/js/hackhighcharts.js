function initChart(chart){
            var container = $(chart.container);
    container.bind('touchstart',function(e,obj){guardaCoordsInicioTouch(e,obj);});
    container.bind('pinch',function(e,obj){pinchChart(e,obj,chart);
});
            container.swiperight(function(event){event.stopPropagation();});
            container.swipeleft(function(event){event.stopPropagation();});
    window.chartZoomStep=2;
    window.lastChartScale=0;
    for(var i=0;i<chart.xAxis.length;i++){
        var extremes=chart.xAxis[i].getExtremes();
//	$('#header').html($('#header').html()+' ini('+extremes.min+','+extremes.max+')');
    }
}

function pinchChart(e,obj,chart){
    if(Math.abs(obj.scale-window.lastChartScale)<.5){
	return;
    }

    if(obj.scale>1 && obj.scale>window.lastChartScale){
	pinchOpenChart(e,obj,chart);
    }
    if(obj.scale<1 || obj.scale<window.lastChartScale){
	pinchCloseChart(e,obj,chart);
    }
    window.lastChartScale=obj.scale;
}


function pinchOpenChart(e,obj,chart){
    var container = $(chart.container),
        offset = container.offset(),
        x, y;
    x = BM_APP_CONTEXT.lastTouchstartX - chart.plotLeft - offset.left;
    y = BM_APP_CONTEXT.lastTouchstartY - chart.plotTop - offset.top;

    if(!chart.isInsidePlot(x, y))
        return;
    var diff=Math.abs(obj.scale-window.lastChartScale);
    abreGrafica(x,x+15,chart);
}

function pinchCloseChart(e,obj,chart){
  var diff=Math.abs(obj.scale-window.lastChartScale);
    cierraGrafica(15,chart);
}

function guardaCoordsInicioTouch(event,obj){
    BM_APP_CONTEXT.lastTouchstartX=event.originalEvent.pageX;
    BM_APP_CONTEXT.lastTouchstartY=event.originalEvent.pageY;

    window.lastChartScale=0;
}

function abreGrafica(x1,x2,chart){
    var xMax=chart.plotWidth;
    var xIni=x1<=x2?x1:x2;
    var xFin=x1>x2?x1:x2;

    var xIniRelativa=xIni/xMax;
    var xFinRelativa=xFin/xMax;
    for(var i=0;i<chart.xAxis.length;i++){
        var extremes=chart.xAxis[i].getExtremes();
        var rango=extremes.max-extremes.min;
	var offset=Math.round(rango*.90/2);
	var x=Math.round(rango*xIniRelativa);
    $('#header').html($('#header').html()+' x('+x+')');

	var calcMin=x-offset;
	var calcMax=x+offset;;
        var min=extremes.dataMin < calcMin?calcMin:extremes.dataMin;
        var max=extremes.dataMax > calcMax?calcMax:extremes.dataMax;
        chart.xAxis[i].setExtremes(min,max);
/*
        var minValRelativo=Math.round(rango*xIniRelativa);
        var maxValRelativo=Math.round(rango*xFinRelativa);
        chart.xAxis[i].setExtremes(extremes.min+minValRelativo,extremes.min+maxValRelativo);*/
	extremes=chart.xAxis[i].getExtremes();
	$('#header').html($('#header').html()+' po-ex('+extremes.min+','+extremes.max+')');
    }
}

function cierraGrafica(escala,chart){
    for(var i=0;i<chart.xAxis.length;i++){
        var extremes=chart.xAxis[i].getExtremes();
        var rango=extremes.max-extremes.min;
	escala=Math.round(escala*rango/100);
        var calcMin=extremes.min-escala;
        var calcMax=extremes.max+escala;
        var min=extremes.dataMin < calcMin?calcMin:extremes.dataMin;
        var max=extremes.dataMax > calcMax?calcMax:extremes.dataMax;
        chart.xAxis[i].setExtremes(min,max);
	$('#header').html($('#header').html()+' ex('+extremes.min+','+extremes.max+')');
    }

}
