//>>built
require({cache:{"url:research/outlets/templates/AdvanceView.html":"<div>\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div title=\"Features\" data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:100%;overflow: hidden; border: 0; padding: 0; margin: 0\",gutters:false' >\r\n\t\t\t<div data-dojo-attach-point=\"advance_feature_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:50%;height:100%\",region:\"left\",splitter:true'></div>\r\n\t\t\t<div data-dojo-attach-point=\"viewfeature\" data-dojo-type=\"prcommon2/advance/advance\" data-dojo-props='region:\"center\",splitter:true,\"class\":\"scrollpanelforce\"'></div>\r\n\t\t</div>\r\n<!--\t\t\r\n\t\t<div title=\"Research Infomation\" data-dojo-type=\"research/advance/researchadvance\" data-dojo-attach-point=\"researchadvance\" data-dojo-props='style:\"width:100%;height:100%\"'></div>\r\n-->\r\n\t\t<div title=\"New Features\" data-dojo-attach-point=\"newfeature\"  data-dojo-type=\"prcommon2/advance/advance\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"advance_delete_dlg\" data-dojo-type=\"dijit/Dialog\" title =\"Delete Feature\">\r\n\t\t<div data-dojo-attach-point=\"advance_delete_ctrl\" data-dojo-type=\"research/advance/AdvanceDelete\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"advance_duplicate_dlg\" data-dojo-type=\"dijit/Dialog\" title =\"Duplicate Feature\">\r\n\t\t<div data-dojo-attach-point=\"advance_duplicate_ctrl\" data-dojo-type=\"research/advance/AdvanceDuplicate\"></div>\r\n\t</div>\r\n</div>\r\n"}});define("research/outlets/AdvanceView",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../outlets/templates/AdvanceView.html","dijit/layout/BorderContainer","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/data/ItemFileReadStore","dojo/_base/lang","dojo/topic","dijit/layout/ContentPane","dijit/Toolbar","dijit/form/DropDownButton","dijit/TooltipDialog","dijit/form/TextBox","dijit/form/Button","dijit/form/ValidationTextBox","dijit/form/Form","dojox/form/BusyButton","dijit/Dialog","prcommon2/advance/advance","research/advance/researchadvance","research/advance/AdvanceDelete","research/advance/AdvanceDuplicate"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _1("research.advance.AdvanceView",[_2,_4],{templateString:_3,constructor:function(){this.advance_feature_model=new _7(new _6({target:"/advance/listoutlet_all",idProperty:"advancefeatureid"}));this._outletid=-1;_d.subscribe(PRCOMMON.Events.Feature_Added,_c.hitch(this,this._advance_add_event));_d.subscribe(PRCOMMON.Events.Feature_Deleted,_c.hitch(this,this._advance_delete_event));_d.subscribe(PRCOMMON.Events.Feature_Updated,_c.hitch(this,this._advance_update_event));},postCreate:function(){this.inherited(arguments);var _e=[{label:"Description",className:"dgrid-column-address-short",field:"feature"},{label:"Publication Date",className:"dgrid-column-address-short",field:"pub_date_display"},{label:" ",className:"grid-field-image-view",field:"",formatter:_9.format_row_ctrl},{label:" ",className:"grid-field-image-view",field:"",formatter:_9.delete_row_ctrl},{label:" ",className:"grid-field-image-view",field:"",formatter:_9.format_copy_ctrl}];this.outlet_advance_grid=new _5({columns:_e,selectionMode:"single",store:this.advance_feature_model,sort:[{attribute:"pub_date_display",descending:false}]});this.advance_feature_view.set("content",this.outlet_advance_grid);this.outlet_advance_grid.on(".dgrid-row:click",_c.hitch(this,this._on_cell_call));this.advance_delete_ctrl.set("dialog",this.advance_delete_dlg);this.advance_duplicate_ctrl.set("dialog",this.advance_duplicate_dlg);this.newfeature.newmode();},_on_cell_call:function(e){var _f=this.outlet_advance_grid.cell(e);if(_f.column.id=="0"||_f.column.id=="1"||_f.column.id=="2"){this.viewfeature.load(_f.row.data.advancefeatureid,this._outletid);}if(_f.column.id=="3"){this.advance_delete_ctrl.load(_f.row.data.advancefeatureid,_f.row.data.feature);this.advance_delete_dlg.show();}if(_f.column.id=="4"){this.advance_duplicate_ctrl.load(_f.row.data.advancefeatureid,_f.row.data.feature);this.advance_duplicate_dlg.show();}},load:function(_10){this._outletid=_10;this.viewfeature.load(-1,_10);this.newfeature.load(-1,_10);this.outlet_advance_grid.set("query",{outletid:this._outletid});},_advance_add_event:function(_11){this.advance_feature_model.add(_11);},_advance_delete_event:function(_12){this.advance_feature_model.remove(_12.advancefeatureid);},_advance_update_event:function(_13){this.advance_feature_model.put(_13);}});});