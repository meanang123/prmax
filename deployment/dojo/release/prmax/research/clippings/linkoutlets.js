//>>built
require({cache:{"url:research/clippings/templates/linkoutlets.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"fa fa-filter fa-3x\",label:\"Filter\",showLabel:false'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td>Source</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_source\" data-dojo-props='name:\"source\",searchAttr:\"name\",labelType:\"html\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Link Code</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_linktext\" data-dojo-props='name:\"linktext\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Link Description</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_linkdescription\" data-dojo-props='name:\"linkdescription\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>URL</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_url\" data-dojo-props='name:\"url\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Not Linked Only</td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"not_linked\" data-dojo-props='name:\"not_linked\",type:\"checkbox\",checked:true' ></td> </tr>\r\n\t\t\t\t\t\t<tr><td>Hide Ignore</td><td><input data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-point=\"hide_ignore\" data-dojo-props='name:\"hide_ignore\",type:\"checkbox\",checked:true' ></td> </tr>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"bottom\",splitter:true,style:\"height:50%;width:100%;\"' data-dojo-attach-point=\"edit_view\" >\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"blank_view\"></div>\r\n\t\t<div data-dojo-type=\"research/clippings/ipcb_outlets\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"ipbc_outlet_link\"></div>\r\n\t\t<div data-dojo-type=\"research/clippings/mbrain_outlets\" data-dojo-props='style:\"width:100%;height:100%\"' data-dojo-attach-point=\"mbrain_outlet_link\"></div>\r\n\t</div>\r\n</div>\r\n\r\n"}});define("research/clippings/linkoutlets",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../clippings/templates/linkoutlets.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Cache","dojo/store/Observable","dojo/store/Memory","dojo/request","ttl/utilities2","dojo/json","dojo/_base/lang","dijit/layout/ContentPane","dijit/Toolbar","dijit/form/DropDownButton","dijit/TooltipDialog","dijit/form/TextBox","dijit/form/CheckBox","dijit/form/Button","dijit/form/ValidationTextBox","dijit/form/Form","dijit/form/FilteringSelect","research/clippings/ipcb_outlets","research/clippings/mbrain_outlets"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _1("research.clippings.linkoutlets",[_2,_4],{templateString:_3,gutters:false,constructor:function(){this._store=new _8(new _6({target:"/research/clippings/list_link",idProperty:"outletexternallinkid"}));this._clippingsources=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=clippingsource&nofilter=1"});this._show_basic_edit_call_back=_d.hitch(this,this._show_basic_edit_call);},postCreate:function(){this.filter_source.set("store",this._clippingsources);var _e=[{label:" ",field:"outletexternallinkid",sortable:false,formatter:_b.generic_view,className:"grid-field-image-view"},{label:"Link Code",className:"dgrid-column-address-short",field:"linktext"},{label:"Link Name",className:"dgrid-column-address-short",field:"linkdescription"},{label:"Prmax OutletId",className:"dgrid-column-status-small",field:"outletid"},{label:"Prmax Outlet",className:"dgrid-column-address-short",field:"outletname"},{label:"Source",className:"dgrid-column-status-small",field:"clipsource"},{label:"Url",className:"dgrid-column-address-short",field:"url"}];this.grid=new _5({columns:_e,selectionMode:"single",store:this._store,query:{not_linked:true,hide_ignore:true},sort:[{attribute:"linktext",descending:false}]});this.grid.on(".dgrid-row:click",_d.hitch(this,this._on_cell_call));this.inherited(arguments);},startup:function(){this.inherited(arguments);this.grid_view.set("content",this.grid);},_on_cell_call:function(e){var _f=this.grid.cell(e);if(_f&&_f.row){if(_f.column.id=="6"){if(_f.row.data.url.length>0){var win=window.open(_f.row.data.url,"_blank");win.focus();}}else{switch(_f.row.data.linktypeid){case "6":case 6:case "7":case 7:this.mbrain_outlet_link.load(_f.row.data.outletexternallinkid,this._show_basic_edit_call_back);break;default:this.ipbc_outlet_link.load(_f.row.data.outletexternallinkid,this._show_basic_edit_call_back);break;}}}},_clear_filter:function(){this.filter_linktext.set("value","");this.filter_linkdescription.set("value","");this.filter_url.set("value","");this.not_linked.set("checked",true);this.hide_ignore.set("checked",true);this.filter_source.set("value",-1);},_execute:function(){var _10={sourcetypeid:this._sourcetypeid};if(this.not_linked.get("checked")){_10["not_linked"]=true;}if(this.hide_ignore.get("checked")){_10["hide_ignore"]=true;}if(this.filter_linktext.get("value")){_10["linktext"]=this.filter_linktext.get("value");}if(this.filter_linkdescription.get("value")){_10["linkdescription"]=this.filter_linkdescription.get("value");}if(this.filter_url.get("value")){_10["linkurl"]=this.filter_url.get("value");}if(this.filter_source.get("value")){_10["clipsource"]=this.filter_source.get("value");}this.grid.set("query",_10);this._clear();},_clear:function(){this.edit_view.selectChild(this.blank_view);},_show_basic_edit_call:function(_11,_12){if(_12){this._store.put(_12);this.edit_view.selectChild(this.blank_view);}else{switch(_11){case "ipcb_outlets":this.edit_view.selectChild(this.ipbc_outlet_link);break;case "mbrain_outlets":this.edit_view.selectChild(this.mbrain_outlet_link);break;}}}});});