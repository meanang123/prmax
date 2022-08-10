/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prcommon.crm.viewer_only"]){dojo._hasResource["prcommon.crm.viewer_only"]=true;dojo.provide("prcommon.crm.viewer_only");dojo.require("prcommon.crm.add");dojo.require("prcommon.crm.output");dojo.declare("prcommon.crm.viewer_only",[ttl.BaseWidget],{widgetsInTemplate:true,templateString:"<div>\r\n\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-point='style:\"width:100%;height:100%\",gutters:false' >\r\n\t\t<span class=\"searchresults\">\r\n\t\t<div data-dojo-type=\"dijit.Toolbar\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:42px;width:100%;overflow:hidden\",\"class\":\"searchresults\"'>\r\n\t\t\t<button data-dojo-type=\"dijit.form.Button\" data-dojo-props='label:\"New\",iconClass:\"fa fa-plus fa-3x\"' data-dojo-attach-event=\"onClick:_new_note\"></button>\r\n\t\t\t<button data-dojo-type=\"dijit.form.Button\" data-dojo-props='label:\"Output\",iconClass:\"fa fa-line-chart fa-3x\"' data-dojo-attach-event=\"onClick:_output_function\"></button>\r\n\t\t</div>\r\n\t\t</span>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\"  data-dojo-props='region:\"center\",splitter:true'>\r\n\t\t\t<div data-dojo-attach-point=\"view_grid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='query:{ },rowsPerPage:30,style:\"width:100%;height:100%\"' ></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"view_details\" data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='style:\"width:100%;height:30%;overflow:auto\",region:\"bottom\",splitter:true'>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"crm_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"New Engagement\", style:\"width:600px;height:700px\"'>\r\n\t\t<div data-dojo-attach-point=\"crm_add\" data-dojo-type=\"prcommon.crm.add\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"output_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Output\"'>\r\n\t\t<div data-dojo-attach-point=\"output_ctrl\" data-dojo-type=\"prcommon.crm.output\"></div>\r\n\t</div>\r\n</div>\r\n",mode:"contact",basic_details_page:"/crm/basic_details_page?contacthistoryid=${contacthistoryid}",constructor:function(){this.filter_db=new prcommon.data.QueryWriteStore({url:"/crm/filter_by_object",nocallback:true,onError:ttl.utilities.globalerrorchecker});this._outletid=null;this._employeeid=null;this._contactid=null;dojo.subscribe("/crm/newnote",dojo.hitch(this,this._new_issue_event));},view1:{cells:[[{name:"Date",width:"80px",field:"taken_display"},{name:"Subject",width:"auto",field:"subject"},{name:"Contact",width:"auto",field:"contactname"},{name:"Status",width:"auto",field:"contacthistorystatusdescription"}]]},view2:{cells:[[{name:"Date",width:"80px",field:"taken_display"},{name:"Subject",width:"auto",field:"subject"},{name:"Status",width:"auto",field:"contacthistorystatusdescription"}]]},postCreate:function(){if(this.mode=="contact"){this.view_grid.set("structure",this.view2);}else{this.view_grid.set("structure",this.view1);}this.view_grid._setStore(this.filter_db);this.view_grid.onRowClick=dojo.hitch(this,this.on_select_row);this.inherited(arguments);},on_select_row:function(e){var _1=this.view_grid.getItem(e.rowIndex);if(_1){this.view_details.set("href",dojo.string.substitute(this.basic_details_page,{contacthistoryid:_1.i.contacthistoryid}));}},load_outlet:function(_2,_3){this._outletid=_2;this._outletname=_3;this.view_grid.setQuery(ttl.utilities.getPreventCache({outletid:this._outletid}));this.crm_add.set("dialog",this.crm_dlg);this.view_details.set("content","");},load_employee:function(_4,_5,_6,_7,_8){this._employeeid=_4;this._contactname=_5;this._contactid=_7;this._outletname=_8;this._outletid=(_6==-1)?null:_6;this.view_grid.setQuery(ttl.utilities.getPreventCache({employeeid:this._employeeid}));this.crm_add.set("dialog",this.crm_dlg);this.view_details.set("content","");},_new_note:function(){this.crm_add.clear();this.crm_add.set("dialog",this.crm_dlg);this.crm_dlg.set("title","<p><i class=\"fa fa-user\"></i>&nbsp;New "+PRMAX.utils.settings.crm_engagement+"</p>");this.crm_add.load(this._outletid,this._outletname,this._employeeid,this._contactname,this._contactid);this.crm_dlg.show();},refresh:function(){this._filter();},resize:function(){this.frame.resize(arguments[0]);},_output_function:function(){this.output_ctrl.clear();this.output_ctrl.set("dialog",this.output_dlg);this.output_dlg.show();},_new_issue_event:function(_9){if((this.mode=="contact"&&this._employeeid===_9.employeeid)||(this.mode!="contact"&&this._outletid===_9.outletid)){this.filter_db.newItem(_9);}this.view_details.set("content","");}});}