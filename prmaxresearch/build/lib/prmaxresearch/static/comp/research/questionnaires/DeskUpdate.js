//-----------------------------------------------------------------------------
// Name:    OutletEdit.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/DeskUpdate.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dijit/layout/TabContainer",
	"research/questionnaires/DeskDetails",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane" ,
	"dijit/layout/StackContainer",
	"research/questionnaires/EmployeeEdit",
	"dijit/Dialog",
	"research/questionnaires/Research",
	"research/questionnaires/EmployeeDelete",
	"research/employees/EmployeeDelete",
	"research/employees/EmployeeEdit",
	"research/outlets/OutletSetPrimary",
	"research/outlets/OutletMoveContact",
	"research/outlets/OutletCopyContact",
	"research/employees/EmployeeMerge"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic, domattr ){
 return declare("research.questionnaires.DeskUpdate",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._load_call_back = lang.hitch(this, this._load_call);
		this._store = new Observable( new JsonRest( {target:'/research/admin/projects/journalist_changes', idProperty:"key"}));
		this._load_new_employee_call_back = lang.hitch(this,this._load_new_employee_call);
		this._load_employee_call_back = lang.hitch(this,this._load_employee_call);
		topic.subscribe(PRCOMMON.Events.Employee_Quest_Add, lang.hitch(this, this._employee_add_event));
		topic.subscribe(PRCOMMON.Events.Employee_Add, lang.hitch(this, this._employee_add_event));
		topic.subscribe(PRCOMMON.Events.Employee_Quest_Updated, lang.hitch(this, this._employee_update_event));
		topic.subscribe("/quest/emp_del", lang.hitch(this, this._employee_delete_event));
		this._row_data = null;
		this.std_menu = null;
		this.std_menu_primary = null;
	},
	postCreate:function()
	{
		var cells =
		[
			{label: ' ', field:"menu", className:"grid-field-image-view", formatter:utilities2.format_row_ctrl,sortable: false},
			{label: 'Done?',field:"applied", className:"dgrid-column-status-small", formatter:this._action_done_function},
			{label: 'Job Title',className:"standard",field:"job_title"},
			{label: 'Contact',className:"standard",field:"contactname"},
			{label: 'Action',field:"actiontypedescription", className:"dgrid-column-statusl"}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			sort: [{ attribute: "job_title", descending: false }]
		});

		this.outlet_contact_grid_view.set("content", this.grid);
		this.grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));

		this.inherited(arguments);
	},
	_action_done_function:function( applied)
	{
		if ( applied == 1)
			return "Yes";

		return "";
	},
	_action_function:function ( data )
	{
		if (data != null)
		{
			if ( data == 3)
				return '<img height="16px" width="16px" style="padding:0x;margin:0px" src="/prcommon/images/delete.gif"></img>';
			else
				return '<img src="/prcommon/images/view.png" alt="view" width="16" height="16" style="padding:0px;margin:0px"/>';
		}
		else
			return ""
	},
	_on_cell_call:function( e)
	{
		var cell = this.grid.cell(e);

		if ( cell == null || cell.row == null) return ;

		if ( cell.column.field =="menu")
		{
			if (cell.row.data.actiontypeid == 2 || cell.row.data.actiontypeid == -1)
			{
				this._row_data = cell.row.data;
				this._show_menu(e,cell.row.data);
				return;
			}
		}

		if (cell.row.data.actiontypeid == 3 && cell.row.data.applied == 0)
		{
			if ( cell.row.data.isprimary == true )
			{
				alert("Cannot Delete as is Primary");
			}
			else
			{
				this._row_data = cell.row.data;
				this.delete_ctrl.load(cell.row.data.key,cell.row.data.job_title, cell.row.data.contactname);
			}
		}
		else if (cell.row.data.actiontypeid == 1 && cell.row.data.applied == 0)
		{
			this._row_data = cell.row.data;
			request.post('/research/admin/projects/load_new_employee_feedback',
				utilities2.make_params({ data : { researchprojectitemid : this._researchprojectitemid, objectid: cell.row.data.objectid }})).
				then ( this._load_new_employee_call_back);
		}
		else if ( cell.row.data.applied == 0 && cell.row.data.actiontypeid == 2 )
		{
			this._row_data = cell.row.data;
			request.post('/research/admin/projects/load_employee_feedback',
				utilities2.make_params({ data : { researchprojectitemid: this._researchprojectitemid, objectid: cell.row.data.objectid }})).
				then ( this._load_new_employee_call_back);
		}
		else if ( cell.row.data.actiontypeid == -1 && cell.row.data.typeid=="E" )
		{
			this._row_data = cell.row.data;
			request.post('/research/admin/projects/load_employee',
				utilities2.make_params({ data : { objectid: cell.row.data.objectid }})).
				then ( this._load_new_employee_call_back);
		}
		else if ( cell.row.data.actiontypeid == 2 && cell.row.data.typeid=="E" ) 
		{
			this._row_data = cell.row.data;
			request.post('/research/admin/projects/load_employee',
				utilities2.make_params({ data : { objectid: cell.row.data.objectid }})).
				then ( this._load_employee_call_back);
		}

	},
	_load_new_employee_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.contact_edit.load (  response.data.data , response.data.user_changes );
			this.contact_edit_container.selectChild( this.contact_edit );
		}
		else
		{
			alert("Problem Loading Changes");
		}
	},
	_load_employee_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.contact_edit.load (  response.data.data );
			this.contact_edit_container.selectChild( this.contact_edit );
		}
		else
		{
			alert("Problem Loading Changes");
		}
	},
	_employee_delete_event:function ( data )
	{
		if (this._row_data != null)
		{
			this._row_data.applied = 1;
			this._store.remove(data);
			this.contact_edit_container.selectChild( this.blank_cont_view );
		}
	},
	_load_call:function ( response )
	{
		if ( response.success=="OK")
		{
			this.desk_main.load ( response.data.projectitem, response.data.outlet, response.data.user_changes ) ;
			this.research_ctrl.load ( response.data.projectitem, response.data.research, response.data.user_changes ) ;

			this.grid.set("query", {
								researchprojectitemid: response.data.projectitem.researchprojectitemid,
								outletdeskid:response.data.projectitem.outletdeskid});

			var tmp = response.data.outlet.outlet.outletid + " - " + response.data.outlet.desk.desk.deskname;
			domattr.set(this.outlet_details_view,"innerHTML",  tmp );
			this._outletid = response.data.outlet.outlet.outletid;
		}
	},
	load:function ( researchprojectitemid)
	{
		this.clear();
		this._researchprojectitemid = researchprojectitemid;
		request.post('/research/admin/projects/load_user_feedback',
				utilities2.make_params({ data : {researchprojectitemid: researchprojectitemid}})).
				then ( this._load_call_back);
	},
	clear:function()
	{
		this.contact_edit_container.selectChild( this.blank_cont_view );
	},
	_employee_add_event:function( key )
	{
		if ( this._row_data != null)
		{
			this._row_data.applied = 1;
			this._store.put(this._row_data);
			this.contact_edit_container.selectChild( this.blank_cont_view );
		}
		else
		{
			key.typeid = "E";
			key.key = key.typeid + key.employeeid;
			key.objectid = key.employeeid;
			key.actiontypeid = -1;

			this._store.add( key );
		}
	},
	_employee_update_event:function( researchprojectchangeid, data, prmaxcontext )
	{
		if (prmaxcontext == "desk" && this._row_data != null && this._row_data != undefined)
		{
			this._row_data.applied = 1;
			if (data != null)
			{
				this._row_data.job_title = data.job_title;
				this._row_data.contactname = data.contactname;
			}
			this._store.put(this._row_data);
			this.contact_edit_container.selectChild( this.blank_cont_view );
		}
	},
	_show_menu:function(e,data)
	{
		if (this.std_menu === null)
		{
			this.std_menu = new dijit.Menu();
			this.std_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:lang.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.std_menu.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:lang.hitch(this,this._delete_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.std_menu.addChild(new dijit.MenuItem({label:"Set Primary Contact", onClick:lang.hitch(this,this._primary_contact),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.std_menu.startup();
		}
		if (this.std_menu_primary === null)
		{
			this.std_menu_primary = new dijit.Menu();
			this.std_menu_primary.addChild(new dijit.MenuItem({label:"Add Contact", onClick:lang.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.std_menu_primary.startup();
		}

		if (data.isprimary==true)
			this.std_menu_primary._openMyself(e);
		else
			this.std_menu._openMyself(e);
	},
		_add_employee:function()
	{
		this._row_data = null;
		this.employee_change_ctrl.set("dialog", this.employee_change_dlg );
		this.employee_change_ctrl.load (  -1 ,  this._outletid ) ;
		this.employee_change_dlg.show();
		this.contact_edit_container.selectChild( this.blank_cont_view );
	},
	_delete_employee:function()
	{
		this.delete_ctrl.load(this._row_data.key,this._row_data.job_title, this._row_data.contactname);
	},
	_primary_contact:function()
	{
		this.employee_set_primary_ctrl.load (  this._row_data.objectid ,   this._row_data.contactname, this._row_data.job_title, this.employee_set_primary_dlg) ;
		this.employee_set_primary_dlg.show();
	},
});
});


