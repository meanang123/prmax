//>>built
define("ttl/FrameMngr",["dijit","dojo","dojox","dojo/require!dijit/layout/StackContainer,dijit/layout/ContentPane"],function(_1,_2,_3){_2.provide("ttl.FrameMngr");_2.provide("ttl.FramePage");_2.provide("ttl.FrameEvents");_2.require("dijit.layout.StackContainer");_2.require("dijit.layout.ContentPane");_2.declare("ttl.FrameMngr",[_1.layout.StackContainer],{load:function(_4){},addPage:function(_5){var _6=null;var _7={preventCache:"True"};for(var a in _5){_7[(a!="id")?a:"key"]=_5[a].toString();}if(typeof (_7["widget"])!="undefined"){_gArray.data1=_7;eval("page = new "+_7["widget"].toString()+"(_gArray.data1,dojo.doc.createElement('div'));");}else{_7["parent"]=_2.doc.createElement("div");_7["parent"].style.cssText="width:100%;height:100%";_6=new ttl.FramePage(_7,_7["parent"]);}this.addChild(_6,0);if(typeof (_5.content)!="undefined"){_6.attr("content",ttl.utilities.unescapeHtml(_5["content"].toString()));}if(_6){this.showPage(_6);}return _6||None;},deletePage:function(_8){},getPage:function(_9){this.key=_9.toString();this.page=null;_2.forEach(this.getChildren(),function(_a){if(this.key===_a.key||this.key===_a.id){this.page=_a;}},this);return this.page;},showPage:function(_b){this.selectChild(_b);},resize:function(){this.inherited(arguments);}});_2.declare("ttl.FrameEvents",null,{init:function(){this.framename="std_view_stack";},clear:function(){},onShow:function(){this.resize();},resize:function(){var _c=_1.byId("std_view_stack");if(_c){var _d=_1.byId(this.key);if(_d){_d.resize(arguments[0]);}}this.inherited(arguments);}});_2.declare("ttl.FramePage",[ttl.layout.ContentPane,ttl.FrameEvents],{framename:"",onShow:function(){}});});