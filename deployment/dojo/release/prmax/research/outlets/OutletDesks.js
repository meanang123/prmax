//>>built
require({cache:{"url:research/outlets/templates/OutletDesks.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-plus fa-3x\",showLabel:true' data-dojo-attach-event=\"onClick:_add_desk\"><span>Add Desk</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\"'>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props=\"region:'bottom',style:'width:100%;height:50%',preload:false,splitter:true\">\r\n\t\t\t<div data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='title:\"blank\",selected:\"selected\"'></div>\r\n\t\t\t<div data-dojo-attach-point=\"desk_update_ctrl\" data-dojo-type=\"prcommon2/outlet/desks/DeskAdd\" data-dojo-props='mode:\"update\",style:\"width:100%;height:100%\",\"class\":\"scrollpanel\"'></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"desk_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Desk\",style:\"width:600px;height:520px\"'>\r\n\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:590px;height:490px\"'>\r\n\t\t\t<div data-dojo-attach-point=\"desk_add_ctrl\" data-dojo-type=\"prcommon2/outlet/desks/DeskAdd\" data-dojo-props='region:\"center\"'></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"}});define("research/outlets/OutletDesks",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../outlets/templates/OutletDesks.html","dijit/layout/BorderContainer","dojo/topic","dojo/_base/lang","ttl/utilities2","dojo/request","dojox/data/JsonRestStore","dojo/data/ItemFileReadStore","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dijit/layout/ContentPane","dijit/form/Form","dijit/form/TextBox","dijit/form/FilteringSelect","dijit/form/Button","dojox/form/BusyButton","dijit/Dialog","prcommon2/outlet/desks/DeskAdd"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_9,_c){return _1("research.outlets.OutletDesk",[_2,_4],{templateString:_3,constructor:function(){this._outletdesks=new _c(new _9({target:"/research/admin/desks/list",idProperty:"outletdeskid"}));_5.subscribe(PRCOMMON.Events.Desk_Updated,_6.hitch(this,this._update_event));_5.subscribe(PRCOMMON.Events.Desk_Added,_6.hitch(this,this._add_event));_5.subscribe(PRCOMMON.Events.Desk_Deleted,_6.hitch(this,this._delete_event));},postCreate:function(){this.inherited(arguments);this.outlet_desk_grid=new _b({columns:[{label:"Outlet Desk",className:"standard",field:"deskname"}],selectionMode:"single",store:this._outletdesks});this.grid_view.set("content",this.outlet_desk_grid);this.outlet_desk_grid.on(" .dgrid-cell:click",_6.hitch(this,this._on_cell_call));this.desk_add_ctrl.set("dialog",_6.hitch(this,this._show_add_function));this.desk_update_ctrl.set("dialog",_6.hitch(this,this._show_update_function));},_show_add_function:function(_d){if(_d=="show"){this.desk_add_dlg.show();}else{this.desk_add_dlg.hide();}},_show_update_function:function(_e){if(_e=="show"){this.controls.selectChild(this.desk_update_ctrl);}else{this.controls.selectChild(this.blank);}},load:function(_f){this.desk_add_ctrl.set("outletid",_f);this.outlet_desk_grid.set("query",{outletid:_f});this.controls.selectChild(this.blank);this.desk_update_ctrl.clear();},clear:function(){this.desk_add_ctrl.set("outletid",-1);this.outlet_desk_grid.set("query",{});},_on_cell_call:function(e){var _10=this.outlet_desk_grid.cell(e);if(_10!=null){this.desk_update_ctrl.load(_10.row.data.outletdeskid);}},_add_desk:function(){this.desk_add_ctrl.clear();this.desk_add_dlg.show();},_update_event:function(_11){this._outletdesks.put(_11.outletdesk);},_add_event:function(_12){this._outletdesks.add(_12.outletdesk);},_delete_event:function(_13){this._outletdesks.remove(_13);}});});