/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.search.PersonSelect"]){dojo._hasResource["prmax.search.PersonSelect"]=true;dojo.provide("prmax.search.PersonSelect");dojo.require("ttl.BaseWidget");dojo.require("ttl.utilities");dojo.require("dijit.Dialog");dojo.require("ttl.Form");dojo.require("prmax.search.standard");dojo.require("prmax.search.person");dojo.require("prcommon.crm.add");dojo.require("prmax.search.PersonSelectDetails");dojo.declare("prmax.search.PersonSelect",[ttl.BaseWidget],{templateString:"<div>\r\n\t<div data-dojo-attach-point=\"search_people_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Find People\",style:\"width:600px;height:530px\"'>\r\n\t\t<form data-dojo-props='\"class\":\"prmaxdefault\",name:\"std_search_person\",cellspacing:\"0\",cellpadding:\"0\",formid:\"std_search_person_form\",onsubmit:\"return false\"' data-dojo-type=\"ttl.Form\" data-dojo-attach-point=\"form_name\">\r\n\t\t\t<input data-dojo-props='type:\"hidden\",value:\"quick\",name:\"search_type\"' data-dojo-type=\"dijit.form.TextBox\" />\r\n\t\t\t<div class=\"paddingrow\">&nbsp;</div>\r\n\t\t\t<div data-dojo-props='usepartial:true,search:\"std_search_quick\",keytypeid:138, name:\"quick_contactfull_ext\"' data-dojo-type=\"prmax.search.person\" data-dojo-attach-point=\"quick_contactfull_ext\"></div>\r\n\t\t\t<hr/>\r\n\t\t\t<div  data-dojo-props='usepartial:true,search:\"std_search_quick\", displayname:\"Outlet Name\",keytypeid:1,name:\"quick_searchname\",value:\"\"' data-dojo-attach-point=\"std_search_outlet_outlet_name\" data-dojo-type=\"prmax.search.standard\"></div>\r\n\t\t\t<hr/><br/>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_clear\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Clear\",\"class\":\"btnleft\",style:\"float:left\",iconClass:\"fa fa-eraser fa-2x\"'></button>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_search\" data-dojo-attach-point=\"searchbtn\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Search\",\"class\":\"btnright\",style:\"float:right\", iconClass:\"fa fa-search fa-2x\"'></button><br style=\"clear:both\"/>\r\n\t\t\t<br/>\r\n\t\t</form>\r\n\t\t<div data-dojo-attach-point=\"viewer_grid\" data-dojo-type=\"dojox.grid.DataGrid\" data-dojo-props='query:{ },rowsPerPage:30' ></div><br/>\r\n\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",label:\"Close\",\"class\":\"btnright\",style:\"float:right\"'></button>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"selectdetails_dlg\" data-dojo-type=\"dijit.Dialog\" data-dojo-props='title:\"Contact Details\",style:\"width:600px;height:400px\"'>\r\n\t\t<div data-dojo-attach-point=\"selectdetails_ctrl\" data-dojo-type=\"prmax.search.PersonSelectDetails\" data-dojo-props='style:\"width:590px;height:390px\"'></div>\r\n\t</div>\r\n</div>\r\n",constructor:function(){this.filter_db=new prcommon.data.QueryWriteStore({url:"/search/list?searchtypeid=7",nocallback:true,onError:ttl.utilities.globalerrorchecker});this._load_call_back=dojo.hitch(this,this._load_call);this._clear_call_back=dojo.hitch(this,this._clear_call);},start_search:function(_1){this.on_select_func=_1;this.search_people_dlg.show();},_search:function(){this.form_name.setExtendedMode(false);var _2=this.form_name.get("value");_2["mode"]=1;_2["search_partial"]=2;_2["searchtypeid"]=7;dojo.xhrPost(ttl.utilities.makeParams({load:this._load_call_back,url:"/search/dosearch",content:_2}));},_load_call:function(_3){this.viewer_grid.setQuery(ttl.utilities.getPreventCache({}));},view:{cells:[[{name:"Outlet",width:"auto",field:"outletname"},{name:"Contact",width:"auto",field:"contactname"},{name:" ",width:"15px",field:"",formatter:ttl.utilities.format_row_ctrl}]]},postCreate:function(){this.viewer_grid.resize({w:595,h:240,t:3});this.viewer_grid.set("structure",this.view);this.viewer_grid._setStore(this.filter_db);this.viewer_grid.onRowClick=dojo.hitch(this,this._on_select_row);this.inherited(arguments);},_on_select_row:function(e){this._row=this.viewer_grid.getItem(e.rowIndex);if(this._row){if(e.cellIndex==2){this.selectdetails_ctrl.set("dialog",this._row.i.employeeid);this.selectdetails_ctrl.load(this.selectdetails_dlg,this._row.i.employeeid);this.selectdetails_dlg.show();}else{this.on_select_func(this._row.i.employeeid,this._row.i.outletid,this._row.i.contactname,this._row.i.outletname);this.search_people_dlg.hide();}}},_clear:function(){this.quick_contactfull_ext.Clear();this.std_search_outlet_outlet_name.Clear();dojo.xhrPost(ttl.utilities.makeParams({load:dojo.hitch(this,this._clear_call_back),url:"/search/sessionclear",content:{searchtypeid:7}}));},_clear_call:function(){this.viewer_grid.setQuery(ttl.utilities.getPreventCache({}));},_close:function(){this.search_people_dlg.hide();}});}