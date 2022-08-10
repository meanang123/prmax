require({cache:{
'url:research/lookups/templates/DeletionHistory.html':"<div>\r\n\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:48px;padding:0px;margin:0px\"'>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxFilterIcon\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Deletion History Filter\" data-dojo-attach-event=\"execute: _execute\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td>Date</td><td><input data-dojo-props='\"class\":\"prmaxbutton\",type:\"text\",name:\"filter_deletiondate\"' data-dojo-type=\"dijit/form/DateTextBox\" data-dojo-attach-point=\"filter_deletiondate\" ></input></td></tr>\r\n\t\t\t\t\t\t<tr><td>Description</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_deletionhistorydescription\" data-dojo-props='name:\"filter_deletionhistorydescription\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Outletname</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_outlet_name\" data-dojo-props='name:\"filter_outlet_name\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Firstname</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_firstname\" data-dojo-props='name:\"filter_firstname\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Surname</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_familyname\" data-dojo-props='name:\"filter_familyname\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Domain</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_domain\" data-dojo-props='name:\"filter_domain\",trim:\"true\",maxlength:45,type:\"text\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Project</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_researchprojectid\" data-dojo-props='name:\"filter_researchprojectid\",autoComplete:true,style:\"width:90%\",searchAttr:\"researchprojectname\",placeHolder:\"No Selection\"'></select></td></tr>\r\n\t\t\t\t\t\t<tr><td>Reason</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_reasoncodeid\" data-dojo-props='name:\"filter_reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td>Type</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_deletionhistorytypeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"filter_deletionhistorytypeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:90%\"'/></td></tr>\r\n\t\t\t\t\t\t<tr><td>User</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"filter_userid\" data-dojo-props='name:\"filter_userid\",autoComplete:\"true\",style:\"width:90%\",labelType:\"html\"' ></td></tr>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick: _clear_filter\" data-dojo-type=\"dijit/form/Button\" type=\"button\" >Clear Filter</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" type=\"submit\" name=\"submit\">Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"PRMaxCommonStdIcon PRMaxAddIcon\",showLabel:true' data-dojo-attach-event=\"onClick: _new_deletionhistory\" > <span>New</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' data-dojo-attach-point=\"grid_view\"></div>\r\n\t\r\n\t<div data-dojo-attach-point=\"deletionhistory_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Deletion\"'>\r\n\t\t<div data-dojo-attach-point=\"deletionhistory_add_ctrl\" data-dojo-type=\"prcommon2/deletionhistory/DeletionHistoryAdd\" data-dojo-props='mode:\"add\"'></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"deletionhistory_update_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Update Deletion\"'>\r\n\t\t<div data-dojo-attach-point=\"deletionhistory_update_ctrl\" data-dojo-type=\"prcommon2/deletionhistory/DeletionHistoryAdd\" data-dojo-props='mode:\"update\"'></div>\r\n\t</div>\r\n\r\n</div>"}});
//-----------------------------------------------------------------------------
// Name:    DeletionHistory.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: August/2019
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/lookups/DeletionHistory", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/DeletionHistory.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"dojox/data/JsonRestStore",	
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/data/ItemFileReadStore",	
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dijit/Dialog",
	"prcommon2/deletionhistory/DeletionHistoryAdd"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRestStore, JsonRest, Observable, ItemFileReadStore, request, utilities2, json, topic, lang){
 return declare("research.lookups.DeletionHistory",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable(new JsonRest({target:'/research/admin/deletionhistory/list', idProperty:"deletionhistoryid"}));
		this.deletionhistorytypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=deletionhistorytype"});
		this._users = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});		
		this._researchprojects = new JsonRestStore({target:'/research/admin/projects/get_list', labelAttribute:"researchprojectname", idProperty:"researchprojectid"});		

		topic.subscribe('deletionhistory/update', lang.hitch(this, this._update_event));
		topic.subscribe('deletionhistory/add', lang.hitch(this, this._add_event));
		topic.subscribe('deletionhistory/delete', lang.hitch(this, this._delete_event));
	},
	postCreate:function()
	{

		var cells =
		[
			{label:' ', field:'deletionhistoryid', sortable: false, formatter:utilities2.generic_view,className:"grid-field-image-view"},
			{label: 'Date',className: "standard",field:'deletiondate'},
			{label: 'ID',className: "standard",field:'objectid'},
			{label: 'Description',className: "standard",field:'deletionhistorydescription'},
			{label: 'Outletname',className: "standard",field:'outlet_name'},
			{label: 'Firstname',className: "standard",field:'firstname'},
			{label: 'Surname',className: "standard",field:'familyname'},
			{label: 'Domain',className: "standard",field:'domain'},
			{label: 'Project',className: "standard",field:'researchprojectname'},
			{label: 'Reason',className: "standard",field:'reasoncodedescription'},
			{label: 'Type',className: "standard",field:'deletionhistorytypedescription'},
			{label: 'User',className: "standard",field:'user_name'}
			
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.grid.on("dgrid-select", dojo.hitch(this,this._on_cell_call));

		this.deletionhistory_add_ctrl.set("dialog", this.deletionhistory_add_dlg);
		this.deletionhistory_update_ctrl.set("dialog", this.deletionhistory_update_dlg);

		this.filter_researchprojectid.set("store", this._researchprojects);
		this.filter_reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Del_Hist_Codes());	
		this.filter_deletionhistorytypeid.set("store", this.deletionhistorytypes);
		this.filter_userid.set("store",this._users);	
		
		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.grid_view.set("content", this.grid);
	},
	_on_cell_call:function(e)
	{
		this.deletionhistory_update_ctrl.load(e.rows[0].data.deletionhistoryid);
	},
	_execute:function()
	{
		var query = {};
		if (arguments[0].filter_deletiondate != null)
			query["deletiondate"] = arguments[0].filter_deletiondate.getFullYear() + "-" + (arguments[0].filter_deletiondate.getMonth() + 1 )  + "-" + arguments[0].filter_deletiondate.getDate();
		if (arguments[0].filter_deletionhistorydescription)
			query["deletionhistorydescription"] = arguments[0].filter_deletionhistorydescription;
		if (arguments[0].filter_outlet_name)
			query["outlet_name"] = arguments[0].filter_outlet_name;
		if (arguments[0].filter_firstname)
			query["firstname"] = arguments[0].filter_firstname;
		if (arguments[0].filter_familyname)
			query["familyname"] = arguments[0].filter_familyname;
		if (arguments[0].filter_domain)
			query["domain"] = arguments[0].filter_domain;
		if (arguments[0].filter_researchprojectid)
			query["researchprojectid"] = arguments[0].filter_researchprojectid;
		if (arguments[0].filter_reasoncodeid)
			query["reasoncodeid"] = arguments[0].filter_reasoncodeid;
		if (arguments[0].filter_deletionhistorytypeid)
			query["deletionhistorytypeid"] = arguments[0].filter_deletionhistorytypeid;
		if (arguments[0].filter_userid)
			query["iuserid"] = arguments[0].filter_userid;

		this.grid.set("query",query);
	},
	_new_deletionhistory:function()
	{
		this.deletionhistory_add_ctrl.clear();
		this.deletionhistory_add_dlg.show();
	},
	_clear_filter:function()
	{
		this.filter_deletiondate.set("value", null);		
		this.filter_deletionhistorydescription.set("value", "");		
		this.filter_outlet_name.set("value", "");		
		this.filter_firstname.set("value", "");		
		this.filter_familyname.set("value", "");		
		this.filter_domain.set("value", "");		
		this.filter_researchprojectid.set("value", null);
		this.filter_reasoncodeid.set("value", null);	
		this.filter_deletionhistorytypeid.set("value", null);
		this.filter_userid.set("value", null);	
	},
	_update_event:function(deletionhistory)
	{
		this._store.put(deletionhistory);
	},
	_add_event:function(deletionhistory)
	{
		this._store.add(deletionhistory);
	},
	_delete_event:function(deletionhistoryid)
	{
		this._store.remove(deletionhistoryid);
	}	
});
});





