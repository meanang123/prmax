//-----------------------------------------------------------------------------
// Name:    projects.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/view.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojox/layout/ExpandoPane",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"research/projects/outletwizard",
	"research/projects/edit",
	"research/projects/update",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button"

	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic,  lang ){
 return declare("research.projects.view",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this.model =  new Observable( new JsonRest( {target:'/research/admin/projects/projects_list', idProperty:"researchprojectid"}));
		this._project_deleted_call_back = lang.hitch(this, this._project_deleted_call);
		this._project_send_call_back = lang.hitch(this, this._project_send_call);
		this.std_menu = null;
		this._is_monthly_std_menu = null;

		topic.subscribe("/project/update", lang.hitch(this, this._update_event));
		topic.subscribe("/project/add", lang.hitch(this, this._add_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label: ' ', field:"menu", className:"grid-field-image-view", formatter:utilities2.format_row_ctrl},
			{label: 'Id', className:"dgrid-column-nbr-right",field:"researchprojectid"},
			{label: 'Project', className:"standard",field:"researchprojectname"},
			{label: 'Owner', className:"standard",field:"ownername"},
			{label: 'Start Date', className:"dgrid-column-date-small",field:"start_date_display"},
			{label: 'Complete Date', className:"dgrid-column-date-small",field:"questionnaire_completed_display"},
			{label: 'Nbr',className:"dgrid-column-nbr-right",field:"count"},
			{label: 'R. Comp',className:"dgrid-column-nbr-right",field:"completed"},
			{label: 'C. Comp',className:"dgrid-column-nbr-right",field:"customer_completed"},
			{label: 'Nbr Em',className:"dgrid-column-nbr-right",field:"nbr_to_email"}

		];
		this.projects_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model,
			sort: [{ attribute: "researchprojectid", descending: true }]
		});

		this.projects.set("content", this.projects_grid);
		this.projects_grid.on(" .dgrid-cell:click", lang.hitch(this,this._on_cell_call));


		topic.subscribe("/projects/list",lang.hitch(this, this._show_list_event));

		this.inherited(arguments);
	},
	_project_deleted_call:function(response)
	{
		if ( response.success == "OK")
		{
			this.model.remove(response.researchprojectid);
		}
		else
		{
			alert("Problem Deleting Project");
		}

	},
	_on_cell_call:function ( e )
	{
		var cell = this.projects_grid.cell(e);

		if (cell == null || cell.row == null ) return;

		this._selected_row = cell.row.data;

		if ( cell.column.field =="menu")
		{
			this._show_menu(e);
		}
		else
		{
			this._edit_project();
		}
	},
	_show_menu:function(evt)
	{
		var menu = null;

		if (this._selected_row.ismonthly==true)
		{
			if (this._is_monthly_std_menu === null)
			{
				this._is_monthly_std_menu = new dijit.Menu();
				this._is_monthly_std_menu.addChild(new dijit.MenuItem({label:"Delete Project", onClick:lang.hitch(this,this._delete_project)}));
				this._is_monthly_std_menu.addChild(new dijit.MenuItem({label:"Edit Project", onClick:lang.hitch(this,this._edit_project)}));
				this._is_monthly_std_menu.addChild(new dijit.MenuItem({label:"Update Project", onClick:lang.hitch(this,this._update_project)}));
				this._is_monthly_std_menu.startup();
			}
			menu = this._is_monthly_std_menu;

		}
		else
		{
			if (this.std_menu === null)
			{
				this.std_menu = new dijit.Menu();
				if (PRMAX.Settings.is_r_adm == true)
					this.std_menu.addChild(new dijit.MenuItem({label:"Send Email", onClick:lang.hitch(this,this._send_quest)}));

				this.std_menu.addChild(new dijit.MenuItem({label:"Delete Project", onClick:lang.hitch(this,this._delete_project)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Edit Project", onClick:lang.hitch(this,this._edit_project)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Update Project", onClick:lang.hitch(this,this._update_project)}));
				this.std_menu.startup();
			}
			menu = this.std_menu;
		}
		menu._openMyself(evt);
	},
	_edit_project:function()
	{
			this.edit.load ( this._selected_row );
			this.zone.selectChild ( this.edit ) ;
	},
	_show_projects:function()
	{
		this.zone.selectChild(this.projects_views);
	},
	_refresh:function()
	{
		this.projects_grid.set("query",{});
	},
	_show_list_event:function()
	{
		this.projects_grid.set("query",{});
		this.zone.selectChild(this.projects_views);
	},
	_delete_project:function()
	{
		if ( confirm("Delete Project"))
		{
		request.post('/research/admin/projects/project_delete',
			utilities2.make_params({ data: {researchprojectid:this._selected_row.researchprojectid}})).then
			(this._project_deleted_call_back);
		}
	},
	_update_project:function()
	{
		this.update_ctrl.load(this._selected_row.researchprojectid);
	},
	_send_quest:function()
	{
		request.post('/research/admin/projects/project_send',
				utilities2.make_params({ data: {researchprojectid:this._selected_row.researchprojectid}})).then
				(this._project_send_call_back);
	},
	_project_send_call:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Set Up for sending");
			this.model.put(response.data);
		}
		else
		{
			alert("Problem sending emails");
		}
	},
	_clear_filter:function()
	{
		this.researchprojectname.set("value","");
	},
	_execute:function()
	{
		var filter = {};

		if ( arguments[0].researchprojectname.length > 0 )
			filter["researchprojectname"] = arguments[0].researchprojectname;

		this.projects_grid.set("query", filter );

	},
	_update_event:function(project)
	{
		this.model.put(project);
	},
	_add_event:function(project)
	{
		this.model.add(project);
	}
});
});






