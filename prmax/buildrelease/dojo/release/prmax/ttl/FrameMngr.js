/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.FrameMngr"]){dojo._hasResource["ttl.FrameMngr"]=true;dojo.provide("ttl.FrameMngr");dojo.provide("ttl.FramePage");dojo.provide("ttl.FrameEvents");dojo.require("dijit.layout.StackContainer");dojo.require("dijit.layout.ContentPane");dojo.declare("ttl.FrameMngr",[dijit.layout.StackContainer],{load:function(_1){},addPage:function(_2){var _3=null;var _4={preventCache:"True"};for(var a in _2){_4[(a!="id")?a:"key"]=_2[a].toString();}if(typeof (_4["widget"])!="undefined"){_gArray.data1=_4;eval("page = new "+_4["widget"].toString()+"(_gArray.data1,dojo.doc.createElement('div'));");}else{_4["parent"]=dojo.doc.createElement("div");_4["parent"].style.cssText="width:100%;height:100%";_3=new ttl.FramePage(_4,_4["parent"]);}this.addChild(_3,0);if(typeof (_2.content)!="undefined"){_3.attr("content",ttl.utilities.unescapeHtml(_2["content"].toString()));}if(_3){this.showPage(_3);}return _3||None;},deletePage:function(_5){},getPage:function(_6){this.key=_6.toString();this.page=null;dojo.forEach(this.getChildren(),function(_7){if(this.key===_7.key||this.key===_7.id){this.page=_7;}},this);return this.page;},showPage:function(_8){this.selectChild(_8);},resize:function(){this.inherited(arguments);}});dojo.declare("ttl.FrameEvents",null,{init:function(){this.framename="std_view_stack";},clear:function(){},onShow:function(){this.resize();},resize:function(){var _9=dijit.byId("std_view_stack");if(_9){var _a=dijit.byId(this.key);if(_a){_a.resize(arguments[0]);}}this.inherited(arguments);}});dojo.declare("ttl.FramePage",[ttl.layout.ContentPane,ttl.FrameEvents],{framename:"",onShow:function(){}});}