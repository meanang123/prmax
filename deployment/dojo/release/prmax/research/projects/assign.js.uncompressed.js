require({cache:{
'url:research/projects/templates/assign.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:44px;width:100%;overflow:hidden\"'>\r\n\t\t<div data-dojo-attach-point=\"researchprojectname\" class=\"dijitToolbar prmaxrowdisplaylarge\" style=\"float:left;height:99%;width:25%;padding:0px;margin:0px\">Project Name</div>\r\n\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-sliders fa-3x\",label:\"Assignment\",showLabel:true' data-dojo-attach-event=\"onClick:_init_btn_event\" data-dojo-attach-point=\"initbtn\"></div>\r\n\t\t\t<div data-dojo-type=\"dijit/form/DropDownButton\"  data-dojo-props='iconClass:\"fa fa-filter fa-3x\",label:\"Filter\",showLabel:true'>\r\n\t\t\t\t<span>Filter By</span>\r\n\t\t\t\t<div data-dojo-type=\"dijit/TooltipDialog\" title=\"Filter\" data-dojo-attach-event=\"execute: _execute_filter\">\r\n\t\t\t\t\t<table>\r\n\t\t\t\t\t\t<tr><td>Outlet Name</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_outletname\" data-dojo-props='type:\"text\",name:\"outletname\"' ></td></tr>\r\n\t\t\t\t\t\t<tr><td>Assign To</td><td><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"filter_owner_name\" data-dojo-props='type:\"text\",name:\"ownername\"' ></td></tr>\r\n\t\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_clear_filter\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' >Clear Filter by</button></td>\r\n\t\t\t\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"submit\",name:\"submit\"'>Filter by</button></td>\r\n\t\t\t\t\t\t</tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-attach-event=\"onClick:_list_of_projects\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-list-alt fa-3x\"'><span>Goto Project List</span></div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dojox/layout/ExpandoPane\" data-dojo-props='title:\"Outlets\",region:\"left\",maxWidth:175,style:\"width:40%;height:100%;overflow:hidden\",splitter:true'>\r\n\t\t<div data-dojo-attach-point=\"grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"height:100%;width:100%\"'></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"tabcont\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-attach-point=\"details_tab\" data-dojo-props='style:\"height:100%\",\"class\":\"scrollpanel\",title:\"Details\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%padding-left:5px\",\"class\":\"scrollpanel\",region:\"center\"'>\r\n\t\t\t\t<form  data-dojo-data='\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t\t\t<input data-dojo-attach-point=\"researchprojectitemid\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"'/>\r\n\t\t\t\t\t<h3 style=\"text-align:left;color:#1E538E\">Contact Details</h3>\t\r\n\t\t\t\t\t<table style=\"width:98%\" class=\"prmaxtable\" cellspacing=\"0\" cellpadding=\"0\" >\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"100px\">Owner</td><td><select data-dojo-attach-point=\"owner_id\" data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='autoComplete:true,required:false,searchAttr:\"owner_name\",name:\"owner_id\"' /></td></tr>\r\n\t\t\t\t\t\t<tr><td colspan=\"2\">&nbsp;</td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"left\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-attach-event=\"onClick:_update_owner\" data-dojo-props='type:\"button\",label:\"Update\"'></button></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</form>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"init_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Project Assignments\" data-dojo-props='style:\"width:600px;height:450px\"'>\r\n\t\t<div data-dojo-type=\"research/projects/init\" data-dojo-attach-point=\"init_ctrl\"></div>\r\n\t</div>\t\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    assign.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: 02/10/2019
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/projects/assign", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/assign.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/data/ItemFileReadStore",
	"dojox/layout/ExpandoPane",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"research/projects/outletwizard",
	"research/outlets/OutletEdit",
	"research/freelance/FreelanceEdit",
	"research/questionnaires/OutletUpdate",
	"research/questionnaires/DeskUpdate",
	"research/questionnaires/FreelanceEdit",
	"dijit/form/ValidationTextBox",
	"dijit/form/Textarea",
	"dijit/form/SimpleTextarea",
	"dijit/form/CheckBox",
	"dojox/validate/regexp",
	"dijit/form/ValidationTextBox",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/FilteringSelect",
	"prcommon2/search/FreelanceSearch",
	"research/outlets/OutletEdit",
	"research/projects/init"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, JsonRestStore, Observable, request, utilities2, json, topic,  lang, domattr, domclass, domstyle, ItemFileReadStore){
 return declare("research.projects.assign",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	prefix:"project",
	constructor: function()
	{
		this.model = new Observable(new JsonRest({target:'/research/admin/projects/projects_members', idProperty:"researchprojectitemid"}));
		this.researchprojectstatus = new ItemFileReadStore({url:"/common/lookups?searchtype=researchprojectstatus&nofilter=1"});
		this._search_store = new Observable(new JsonRest({target:'/search/list_rest?searchtypeid=5&research=1', idProperty:"sessionsearchid"}));
		this._users1 = new ItemFileReadStore({url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});
		this._users = new JsonRestStore( {target:'/research/admin/user/list_researchers', labelAttribute:"owner_name",idProperty:"owner_id"});		
		//this._users = new ItemFileReadStore({url:"/research/admin/user/list_researchers"});
		this._researchers = new ItemFileReadStore({url:"/research/admin/user/listuserselection_researchers"});

		this._update_call_back = lang.hitch(this, this._update_call);
		this._resend_call_back = lang.hitch(this, this._resend_call);
		this._load_research_call_back = lang.hitch(this, this._load_research_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._append_call_back = lang.hitch(this,this._append_call);
		this._clear_search_call_back = lang.hitch(this, this._clear_search_call);
		this._delete_search_row_call_back = lang.hitch(this, this._delete_search_row_call);
		this._delete_project_item_call_back =lang.hitch(this,this._delete_project_item_call);
		this._update_owner_call_back = lang.hitch(this, this._update_owner_call);
		this.std_menu = null;
		
		topic.subscribe('researchprojectitem/update_assignment', lang.hitch(this, this._researchprojectitem_update_assignment_event));

	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'OutletID',className:"dgrid-column-status-small",field:"outletid"},
			{label: 'Outlet',className:"standard",field:"outletname"},
			{label: 'Desk',className:"standard",field:"deskname"},
			{label: 'Status', className:"standard",field:"researchprojectstatusdescription"},
			{label: 'Assign to', className:"standard",field:"owner_name"},
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model
		});
		this.grid_view.set("content", this.grid);
		this.grid.on(" .dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		
		this.owner_id.set("store", this._users);
		//this.owner_id2.set("store", this._users1);

		this.inherited(arguments);
	},
	_on_cell_call:function(e)
	{
		var cell = this.grid.cell(e);
		if ( cell.row == undefined || cell.row.data == undefined) return;
		this._data = cell.row.data;
		this.researchprojectitemid.set("value", this._data.researchprojectitemid);
		this.owner_id.set("value", this._data.owner_id);
	},
	load:function(project)
	{
		this.researchprojectid = project.researchprojectid;
		this.grid.set("query", {researchprojectid:project.researchprojectid});
	},
	_clear:function()
	{

	},
	_clear_filter:function()
	{
		this.filter_outletname.set("value","");
		this.filter_owner_name.set("value","");
	},
	_execute_filter:function()
	{
		var query = {researchprojectid:this.researchprojectid};

		if ( arguments[0].outletname != "")
			query["outletname"] = arguments[0].outletname;

		if ( arguments[0].ownername != "")
			query["owner_name"] = arguments[0].ownername;

		this.grid.set("query",query);
	},
	_list_of_projects:function()
	{
		topic.publish("/projects/list");
	},
	_get_form:function()
	{
		var form = null;

		dojo.every(this.search_tabcont.selectedChildWidget.getChildren(),
			function(widget)
			{
				if ( widget.formid != null)
					form = widget;
			});
		return form;
	},
	_load_call:function( response )
	{
		this.searchbutton.cancel();
		this.grid_search.set("query",{});
	},
	_init_btn_event:function()
	{
		this.init_ctrl.load(this.init_dlg, this.researchprojectid);
		this.init_dlg.show();
	},
	_update_owner:function()
	{
		var data = this.form.get("value");

		request.post('/research/admin/projects/project_item_assignment_update',
			utilities2.make_params({ data: data})).then
			(this._update_owner_call_back);
	},
	_update_owner_call:function(response)
	{
		if (response.success == "OK")
		{
			alert("Assignment has been updated successfully");
		}
	},
	_researchprojectitem_update_assignment_event:function()
	{

		this.grid.set("query", {researchprojectid:this.researchprojectid});
	}
	
});
});
