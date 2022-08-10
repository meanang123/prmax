/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.sales.prospects.bounces.view"]){dojo._hasResource["prmax.iadmin.sales.prospects.bounces.view"]=true;dojo.provide("prmax.iadmin.sales.prospects.bounces.view");dojo.require("ttl.BaseWidget");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.Toolbar");dojo.require("dijit.form.Button");dojo.require("dijit.form.DropDownButton");dojo.require("dijit.TooltipDialog");dojo.require("dijit.layout.ContentPane");dojo.require("dojox.grid.DataGrid");dojo.require("dijit.layout.StackContainer");dojo.declare("prmax.iadmin.sales.prospects.bounces.view",[ttl.BaseWidget,dijit.layout.BorderContainer],{widgetsInTemplate:true,templateString:dojo.cache("prmax","iadmin/sales/prospects/bounces/templates/view.html","<div>\r\n\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:45px;width:100%;overflow:hidden\"'>\r\n\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_refresh\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='iconClass:\"PRMaxStdIcon PRMaxRefreshIcon\"'><span>Refresh</span></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit.form.DropDownButton\"  data-dojo-props='iconClass:\"PRMaxStdIcon PRMaxFilterIcon\",showLabel:true'>\r\n\t\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t\t<div data-dojo-type=\"dijit.TooltipDialog\" data-dojo-props='title:\"Filter By\"' data-dojo-attach-event=\"execute:_execute_filter\">\r\n\t\t\t\t\t\t<table>\r\n\t\t\t\t\t\t\t<tr><td><label>Email Address</label></td><td><input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"emailaddress\" data-dojo-props='type:\"text\",name:\"emailaddress\"' ></td></tr>\r\n\t\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\"' >Clear Filter</button></td>\r\n\t\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter</button></td>\r\n\t\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t</table>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%\"'>\r\n\t\t<div data-dojo-attach-point=\"result_grid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='style:\"height:100%;width:100%\",rowsPerPage:50'></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"tabcont\" data-dojo-type=\"dijit.layout.StackContainer\" data-dojo-props=\"region:'center',splitter:true,'class':'bordered'\">\r\n\t\t<div title=\"blank\" data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit.layout.ContentPane\" selected class=\"bordered\"></div>\r\n\t</div>\r\n</div>\r\n"),constructor:function(){this._store=new dojox.data.JsonRestStore({target:"/dataadmin/prospects/bounces/list",idAttribute:"mailingentryid"});},clear:function(){},postCreate:function(){this.result_grid.set("structure",this.view);this.result_grid._setStore(this._store);this.result_grid.onStyleRow=dojo.hitch(this,ttl.GridHelpers.onStyleRow);this.result_grid.onRowClick=dojo.hitch(this,this._on_select_row);this.inherited(arguments);},_on_select_row:function(e){this._row=this.result_grid.getItem(e.rowIndex);this.result_grid.selection.clickSelectEvent(e);},view:{cells:[[{name:" ",width:"12px",field:"",formatter:ttl.utilities.formatRowCtrl},{name:" ",width:"12px",field:"",formatter:ttl.utilities.deleteRowCtrl},{name:"Email",width:"200px",field:"email"},{name:"Contact",width:"200px",field:"contactname"},{name:"Company",width:"200px",field:"companyname"}]]},_refresh:function(){this._clear_filter();},_clear_filter:function(){this.emailaddress.set("value","");},_execute_filter:function(){var _1={};if(arguments[0].emailaddress.length>0){_1["emailaddress"]=arguments[0].emailaddress;}this.result_grid.setQuery(_1);this.clear();}});}