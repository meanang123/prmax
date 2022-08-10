/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.GridHelpers"]){dojo._hasResource["ttl.GridHelpers"]=true;dojo.provide("ttl.GridHelpers");dojo.declare("ttl.GridHelpers",null,{initGridInLayout:function(_1,_2){var _1=dijit.byId(_1),_2=dijit.byId(_2);dojo.connect(_1,"resize",_2,function(){_2.resize();});_1.onShow=function(){setTimeout(function(){_2.render();},0);};_2.update();},isGridRendered:function(_3){return (_3.model.data.length>0)?true:false;},AddRowToQueryWriteGrid:function(_4,_5){_4._addItem(_5,_5.n);}});ttl.GridHelpers.onStyleRow=function(_6,_7,_8){if(_6.selected){_6.customClasses+=" prmaxSelectedRow";}if(_6.odd){_6.customClasses+=" dojoxGridRowOdd";}if(_6.over){_6.customClasses+=" dojoxGridRowOver";}if(_7!=null&&_7!=undefined){var _9=_7.getItem(_6.index);if(_9&&_8(_9)){_6.customClasses+=" selectedRow";}}};}