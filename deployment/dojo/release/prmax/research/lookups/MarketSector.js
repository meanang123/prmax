//>>built
require({cache:{"url:research/lookups/templates/MarketSector.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Enter Market Sector filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td>Text</td>\r\n\t\t\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter\" data-dojo-props='name:\"filter\",trim:\"true\",maxlength:45,type:\"text\"' ></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true' data-dojo-attach-event=\"onClick: _new_market_sector\" > <span>New</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\r\n\t<div data-dojo-attach-point=\"marketsector_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Market Sector Add\"'>\r\n\t\t<div data-dojo-attach-point=\"marketsector_add_ctrl\" data-dojo-type=\"prcommon2/marketsector/MarketSectorAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"marketsector_update_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Market Sector Update\"'>\r\n\t\t<div data-dojo-attach-point=\"marketsector_update_ctrl\" data-dojo-type=\"prcommon2/marketsector/MarketSectorAdd\" data-dojo-props='mode:\"update\"'></div>\r\n\t</div>\r\n</div>"}});define("research/lookups/MarketSector",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../lookups/templates/MarketSector.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/topic","dojo/_base/lang","dijit/layout/ContentPane","dijit/Toolbar","dijit/form/DropDownButton","dijit/TooltipDialog","dijit/form/TextBox","dijit/form/Button","dijit/form/ValidationTextBox","dijit/form/Form","prcommon2/marketsector/MarketSectorAdd","dijit/Dialog"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c){return _1("research.lookups.MarketSector",[_2,_4],{templateString:_3,gutters:true,constructor:function(){this._store=new _7(new _6({target:"/research/admin/marketsector/list",idProperty:"marketsectorid"}));_b.subscribe(PRCOMMON.Events.Market_Sector_Update,_c.hitch(this,this._update_event));_b.subscribe(PRCOMMON.Events.Market_Sector_Added,_c.hitch(this,this._add_event));_b.subscribe(PRCOMMON.Events.Market_Sector_Deleted,_c.hitch(this,this._delete_event));},postCreate:function(){var _d=[{label:" ",field:"marketsectorid",sortable:false,formatter:_9.generic_view,className:"grid-field-image-view"},{label:"Market Sector ",className:"standard",field:"marketsectordescription"}];this.grid=new _5({columns:_d,selectionMode:"single",store:this._store,query:{}});this.grid.on("dgrid-select",dojo.hitch(this,this._on_cell_call));this.marketsector_add_ctrl.set("dialog",this.marketsector_add_dlg);this.marketsector_update_ctrl.set("dialog",this.marketsector_update_dlg);this.inherited(arguments);},startup:function(){this.inherited(arguments);this.grid_view.set("content",this.grid);},_on_cell_call:function(e){this.marketsector_update_ctrl.load(e.rows[0].data.marketsectorid);},_execute:function(){var _e={};if(arguments[0].filter){_e["marketsectordescription"]=arguments[0].filter;}this.grid.set("query",_e);},_new_market_sector:function(){this.marketsector_add_ctrl.clear();this.marketsector_add_dlg.show();},_clear_filter:function(){this.filter.set("value","");},_update_event:function(_f){this._store.put(_f);},_add_event:function(_10){this._store.add(_10);},_delete_event:function(_11){this._store.remove(_11);}});});