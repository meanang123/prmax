//>>built
require({cache:{"url:research/outlets/templates/Outlets.html":"<div>\r\n\t<div  data-dojo-attach-point=\"expframe\"  data-dojo-type=\"dojox/layout/ExpandoPane\" data-dojo-props='title:\"Results\",region:\"left\",style:\"width:50%;height:100%;overflow: hidden;border:1px solid black\",splitter:true'>\r\n\t\t<div data-dojo-type=\"research/search\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false'></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"center\",splitter:true,gutters:false'>\r\n\t\t<div data-dojo-props='title:\"blank\"' data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\"></div>\r\n\t\t<div data-dojo-props='style:\"width:100%;height:100%;border:1px solid black\",title:\"outlet\"' data-dojo-attach-point=\"outletedit\" data-dojo-type=\"research/outlets/OutletEdit\" ></div>\r\n\t\t<div data-dojo-props='title:\"freelance\",style:\"width:100%;height:100%;border:1px solid black\"' data-dojo-attach-point=\"freelanceedit\" data-dojo-type=\"research/freelance/FreelanceEdit\" ></div>\r\n\t\t<div data-dojo-props='title:\"internaltional\",style:\"width:100%;height:100%;border:1px solid black\"' data-dojo-attach-point=\"internationaledit\" data-dojo-type=\"research/international/Edit\" ></div>\r\n\t</div>\r\n</div>\r\n"}});define("research/outlets/Outlets",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../outlets/templates/Outlets.html","dijit/layout/BorderContainer","dojo/topic","dojo/_base/lang","dojo/dom-attr","dojox/layout/ExpandoPane","research/search","dijit/layout/StackContainer","dijit/layout/ContentPane","research/outlets/OutletEdit","research/freelance/FreelanceEdit","research/employees/ContactInterests","research/international/Edit"],function(_1,_2,_3,_4,_5,_6,_7){return _1("research.outlets.Outlets",[_2,_4],{templateString:_3,gutters:false,constructor:function(){_5.subscribe(PRCOMMON.Events.Display_Load,_6.hitch(this,this._load_event));_5.subscribe(PRCOMMON.Events.Outlet_Deleted,_6.hitch(this,this._outlet_deleted_event));_5.subscribe("LoadParentOutlet",_6.hitch(this,this._load_event));_5.subscribe("LoadChildOutlet",_6.hitch(this,this._load_event));},_load_event:function(_8,_9,_a){if(_a!=1&&_a!=2&&_a!=3){this.controls.selectChild(this.internationaledit);this.internationaledit.load(_8);}else{if(_9=="freelance"){this.controls.selectChild(this.freelanceedit);this.freelanceedit.load(_8);}else{this.controls.selectChild(this.outletedit);this.outletedit.load(_8);}}},_outlet_deleted_event:function(_b){this.controls.selectChild(this.blank);this.freelanceedit.clear();this.outletedit.clear();}});});