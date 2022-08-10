/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.clippings.view"]){dojo._hasResource["prmax.iadmin.clippings.view"]=true;dojo.provide("prmax.iadmin.clippings.view");dojo.require("prmax.iadmin.clippings.add_order");dojo.require("prmax.iadmin.clippings.update_order");dojo.require("prmax.iadmin.clippings.update_expiry_date");dojo.require("dojox.data.JsonRestStore");dojo.declare("prmax.iadmin.clippings.view",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div  data-dojo-attach-point=\"border_control\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='gutters:false,\"class\":\"clientview\",style:\"width:100%;height:100%;overflow: hidden\"'>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:42px;width:100%;overflow:hidden\", \"class\":\"std_menu_view\"'>\r\n\t\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='style:\"float:left;height:99%;width:100%;padding:0px;margin:0px\",\"class\":\"dijitToolbarTop\"'>\r\n\t\t\t\t<div data-dojo-attach-event=\"onClick:_add\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-plus fa-3x\",label:\"Add Order\"'></div>\r\n\t\t\t\t<div data-dojo-attach-event=\"onClick:_update_expiry_date\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"fa fa-pencil fa-3x\",label:\"Update Expiry Date\"'></div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\",style:\"width:100%;height:50%\"'>\r\n\t\t\t<div data-dojo-attach-point=\"grid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='style:\"height:100%;width:100%\",rowsPerPage:50,splitter:true'></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"clipping_add_dialog\" data-dojo-props='title:\"Add Clipping Order\"'>\r\n\t\t<div data-dojo-type=\"prmax.iadmin.clippings.add_order\" data-dojo-attach-point=\"clipping_add_ctrl\" data-dojo-props='mode:\"add\",\"class\":\"scrollpanel\",style:\"width:100%;height:100%\"'></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"clipping_upd_dialog\" data-dojo-props='title:\"Update Clipping Order\"'>\r\n\t\t<div data-dojo-type=\"prmax.iadmin.clippings.update_order\" data-dojo-attach-point=\"clipping_upd_ctrl\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\"'></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"update_expiry_date_dialog\" data-dojo-props='title:\"Update Expiry Date\"'>\r\n\t\t<div data-dojo-type=\"prmax.iadmin.clippings.update_expiry_date\" data-dojo-attach-point=\"update_expiry_date_ctrl\" data-dojo-props='\"class\":\"scrollpanel\",style:\"width:100%;height:100%\"'></div>\r\n\t</div>\r\n</div>\r\n\r\n",constructor:function(){this._clippings_orders_model=new dojox.data.JsonRestStore({target:"/iadmin/clippings/list_orders",idAttribute:"clippingsorderid"});this._get_model_item_call=dojo.hitch(this,this._get_model_item);dojo.subscribe("/clippings/order/add",dojo.hitch(this,this._add_order_event));dojo.subscribe("/clippings/order/upd",dojo.hitch(this,this._update_order_event));dojo.subscribe("/clippings/order/update_expiry_date",dojo.hitch(this,this._update_expiry_date_event));this._icustomerid=null;},postCreate:function(){this.grid.set("structure",this.view1);this.grid._setStore(this._clippings_orders_model);this.grid["onCellClick"]=dojo.hitch(this,this._on_cell_click_call);this.grid.onStyleRow=dojo.hitch(this,this._on_style_row_call);this.inherited(arguments);},_on_style_row_call:function(_1){try{var d=this._clippings_orders_model.getValue(this.grid.getItem(_1.index),"enddate",null).split("-");var dd=new Date(d[0],d[1]-1,d[2]);if(dd<new Date()){_1.customClasses+=" prmaxOverDueRow";}}catch(e){}},_on_cell_click_call:function(e){this._row=this.grid.getItem(e.rowIndex);this.clipping_upd_ctrl.load(this._row.clippingsorderid,this.clipping_upd_dialog,this._icustomerid,this.end_date);this.grid.selection.clickSelectEvent(e);},view1:{cells:[[{name:"Clipping Order",width:"auto",field:"description"},{name:"Source",width:"auto",field:"clippingsourcedescription"},{name:"Price Level",width:"auto",field:"clippingpriceserviceleveldescription"},{name:"Keywords",width:"auto",field:"keywords"},{name:"Status",width:"auto",field:"clippingorderstatusdescription"},{name:"Expiry Date",width:"auto",field:"enddate"},{name:" ",width:"15px",styles:"text-align: center;",width:"20px",formatter:ttl.utilities.formatRowCtrl}]]},resize:function(){this.border_control.resize(arguments[0]);},_add:function(){this.clipping_add_ctrl.clear();this.clipping_add_dialog.show();},load:function(_2,_3){this.end_date=_3;this._icustomerid=_2;this.grid.setQuery(dojo.mixin(ttl.utilities.getPreventCache(),{icustomerid:_2}));this.clipping_add_ctrl.load(this.clipping_add_dialog,_2,_3);},_add_order_event:function(_4){this._clippings_orders_model.newItem(_4);},_update_order_event:function(_5){this.tmp_row=null;var _6={identity:_5.clippingsorderid,onItem:this._get_model_item_call};this._clippings_orders_model.fetchItemByIdentity(_6);if(this.tmp_row){this._clippings_orders_model.setValue(this.tmp_row,"description",_5.description,true);this._clippings_orders_model.setValue(this.tmp_row,"nbrclips",_5.nbrclips,true);this._clippings_orders_model.setValue(this.tmp_row,"clippingpriceserviceleveldescription",_5.clippingpriceserviceleveldescription,true);this._clippings_orders_model.setValue(this.tmp_row,"keywords",_5.keywords,true);this._clippings_orders_model.setValue(this.tmp_row,"enddate",_5.enddate,true);}},_update_expiry_date_event:function(_7){for(var x=0;x<=this.grid._by_idx.length-1;x++){this._clippings_orders_model.setValue(this.grid._by_idx[x].item,"enddate",_7,true);}},_get_model_item:function(){this.tmp_row=arguments[0];},_update_expiry_date:function(){this.update_expiry_date_ctrl.clear();this.update_expiry_date_ctrl.load(this.update_expiry_date_dialog,this._icustomerid);this.update_expiry_date_dialog.show();}});}