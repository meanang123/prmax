//-----------------------------------------------------------------------------
// Name:    viewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.tasks.viewer");

dojo.require("prcommon.crm.tasks.add");
dojo.require("prcommon.crm.tasks.update");
dojo.require("prcommon.crm.tasks.addtype");
dojo.require("prcommon.crm.tasks.updatetype");
_add_new_line = function(inDatum)
{
	return inDatum ? inDatum.replace('====', '<br />'): '';
};

_add_green_check = function(inDatum)
{
	if (inDatum)
	{
		var idx = inDatum.search('====');
		if (inDatum.substr(idx+4, inDatum.length).trim().toLowerCase() == 'completed')
		{
			return '<div style="text-align:center">' + inDatum.substr(0, idx) + '<br /><i class="fa fa-check-circle-o fa-2x" style="color:#27BD59; aria-hidden="true"></i></div>';
		}else
		{
			return '<div style="text-align:center">' + inDatum.substr(0, idx) + '<br /><i class="fa fa-check-circle-o fa-2x" style="color:#F6F6F6; aria-hidden="true"></i></div>';
		}
		
	}
	else{
		return '';
	};
};

dojo.declare("prcommon.crm.tasks.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.tasks","templates/viewer.html"),
	constructor: function()
	{
		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/crm/tasks/tasks',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker
		});

		this._tasktype = new prcommon.data.QueryWriteStore (
			{url:'/crm/tasks/list_tasktypes',
			nocallback:true,
			onError:ttl.utilities.globalerrorchecker
			});

		this._tasktypestatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktypestatus"});
		this._users = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});

		this._taskstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus&nofilter=1"});

		dojo.subscribe(PRCOMMON.Events.Task_Add,dojo.hitch(this,this._add_task_event));
		dojo.subscribe(PRCOMMON.Events.Task_Update,dojo.hitch(this,this._update_task_event));
		dojo.subscribe("tasktype/update", dojo.hitch(this,this._update_tasktype_event));
		dojo.subscribe("tasktype/add", dojo.hitch(this,this._add_tasktype_event));

		this._get_model_item_call = dojo.hitch ( this, this._get_model_item);
	},
	_view : { noscroll: false,
		cells: [[
		//{name: 'Contact',width: "30%",field:'contactdetails_display',formatter:_add_new_line},
		//{name: 'Details',width: "30%",field:'details_display',formatter:_add_new_line},
		//{name: 'Status',width: "20%",field:'status_display',formatter:_add_green_check},
		//{name: 'Status2',width: "10%",field:'taskstatusid'},
		//{name: 'Owner',width: "10%",field:'isassigntoid'}
		
		//]]		
			{name: 'Contact',width: "200px",field:'contactdetails_display',formatter:_add_new_line},
			{name: 'Details',width: "300px",field:'details_display',formatter:_add_new_line},
			{name: 'Status',width: "100px",field:'status_display',formatter:_add_green_check}
			]]
		
		//cells: [[
		//{name: 'Owner',width: "150px",field:'display_name'},
		//{name: 'Date',width: "60px",field:'due_date_display'},
		//{name: 'Status',width: "80px",field:'taskstatusdescription'},
		//{name: 'Contact',width: "120px",field:'contactname'},
		//{name: 'Subject',width: "200px",field:'description'},
		//{name: 'Outlet',width: "200px",field:'outletname'}
		//]]
			
	},
	_view_tasktypes : { noscroll: false,
		cells: [[
		{name: 'Description',width: "400px",field:'tasktypedescription'},
		{name: 'Status', width: "100px", field:'tasktypestatusdescription'}
		]]
	},
	postCreate:function()
	{
	
		//var view = {
		//cells: [[
		//	{name: 'Contact',width: "40%",field:'contactdetails_display',formatter:_add_new_line},
		//	{name: 'Details',width: "40%",field:'details_display',formatter:_add_new_line},
		//	{name: 'Status',width: "20%",field:'status_display',formatter:_add_green_check}
		//	]]
		//	};	
	
		this.viewer_grid.set("structure", this._view);
		//this.viewer_grid.set("structure", view);
		this.viewer_grid._setStore(this.filter_db);
		this.viewer_grid.setQuery({taskstatusid:1,ownerid:PRMAX.utils.settings.uid});

		this.viewer_grid.onRowClick = dojo.hitch(this,this.on_select_row);
		this.viewer_grid.onStyleRow = dojo.hitch(this,this.on_style_row);

		this.tasktype_grid.set("structure", this._view_tasktypes);
		this.tasktype_grid._setStore(this._tasktype);
		this.tasktype_grid.onRowClick = dojo.hitch(this,this.on_tasktype_select_row);

		this.taskstatusid.store = this._taskstatus;
		this.taskstatusid.set("value",1);
		this.ownerid.store = this._users;
		this.ownerid.set("value", PRMAX.utils.settings.uid );

		this.inherited(arguments);
	},
	on_style_row: function(in_row)
	{
		var row_data = this.viewer_grid.getItem(in_row.index);

		console.log(row_data);

		if (row_data && row_data.i.isoverdue == true)
		{
			in_row.customClasses += " prmaxOverDueRow";
			return ;
		}

		if (row_data && row_data.i.taskstatusid == 3)
		{
			in_row.customClasses += " prmaxCompletedRow";
			return ;
		}

		ttl.GridHelpers.onStyleRow(in_row);

	},
	on_select_row : function(e)
	{
		var row = this.viewer_grid.getItem(e.rowIndex);

		this.update_task_ctrl.load( row.i.taskid);

		this.viewer_grid.selection.clickSelectEvent(e);
	},
	on_tasktype_select_row : function(e)
	{
		var row = this.tasktype_grid.getItem(e.rowIndex);
		this.updatetasktypectrl.load(this.updatetasktypedlg, row.i.tasktypeid);
		this.updatetasktypedlg.show();
		this.tasktype_grid.selection.clickSelectEvent(e);
	},
	_filter:function()
	{
		var query = {};

		if ( arguments[0].overdue =="1" )
			query["overdue"] = "on";

		if ( arguments[0].taskstatusid != "-1" )
			query["taskstatusid"] = arguments[0].taskstatusid;

		if ( arguments[0].ownerid != "-1" )
			query["ownerid"] = arguments[0].ownerid;

		if ( arguments[0].subject !="" )
			query["subject"] = arguments[0].subject;

		this.viewer_grid.setQuery(ttl.utilities.getPreventCache( query ));
		this.update_task_ctrl.clear();

	},
	_clear_filter:function()
	{
		this.overdue.set("checked",false);
		this.taskstatusid.set("value",1);
		this.subject.set("value","");
		this.ownerid.set("value",PRMAX.utils.settings.uid)
	},
	load:function()
	{
		this.refresh() ;
	},
	refresh:function (  )
	{
		this._filter();
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	_new_task:function()
	{
		this.newtaskctrl.load ( this.newtaskdlg) ;
		this.newtaskdlg.show();
	},
	_add_task_event:function( task )
	{
		this.filter_db.newItem( task );
		this.viewer_grid.setQuery({taskstatusid:1,ownerid:PRMAX.utils.settings.uid});
	},
	_update_task_event:function( task )
	{
		this.tmp_row = null;
		var item  =
				{identity:task.taskid,
				onItem: this._get_model_item_call
				};

		this.filter_db.fetchItemByIdentity(item);

		if (this.tmp_row)
		{
			this.filter_db.setValue(  this.tmp_row, "user_name", task.user_name, true );
			this.filter_db.setValue(  this.tmp_row, "due_date_display", task.due_date_display, true );
			this.filter_db.setValue(  this.tmp_row, "taskstatusdescription", task.taskstatusdescription, true );
			this.filter_db.setValue(  this.tmp_row, "description", task.description, true );
		}
	},
	_update_tasktype_event:function(tasktype)
	{
		this.tmp_row = null;
		var item  =
				{identity:tasktype.tasktypeid,
				onItem: this._get_model_item_call
				};

		var itemstatus = {identity:tasktype.tasktypestatusid};
		this._tasktype.fetchItemByIdentity(item);

		if (this.tmp_row)
		{
			this._tasktype.setValue(this.tmp_row, "tasktypedescription", tasktype.tasktypedescription, true );
			this._tasktype.setValue(this.tmp_row, "tasktypestatusid", tasktype.tasktypestatusid, true );
			this.tasktype_grid.setQuery({});
		}
	},
	_get_model_item:function()
	{
		if ( arguments[0].i.i != null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_edit_tasks:function()
	{
		this.controls2.selectChild(this.tasks_view) ;
		dojo.addClass( this.backbtn.domNode,"prmaxhidden");
		dojo.addClass(this.newstasktypebtn.domNode, "prmaxhidden");
		dojo.removeClass( this.newtaskbtn.domNode,"prmaxhidden");
		dojo.removeClass( this.filterbtn.domNode,"prmaxhidden");
		dojo.removeClass( this.tasktypebtn.domNode,"prmaxhidden");
	},
	_edit_tasktype:function()
	{
		this.controls2.selectChild(this.tasktype_grid) ;
		dojo.addClass( this.newtaskbtn.domNode,"prmaxhidden");
		dojo.addClass( this.filterbtn.domNode,"prmaxhidden");
		dojo.addClass( this.tasktypebtn.domNode,"prmaxhidden");
		dojo.removeClass( this.backbtn.domNode,"prmaxhidden");
		dojo.removeClass(this.newstasktypebtn.domNode, "prmaxhidden");
	},
	_add_tasktype_event:function( tasktype)
	{
		tasktype.id = tasktype.tasktypeid;
		tasktype.name = tasktype.tasktypedescription;
		this._tasktype.newItem(tasktype);
		this.tasktype_grid.setQuery({});
	},
	_add_tasktype:function()
	{
		this.newtasktypectrl.load ( this.newtasktypedlg) ;
		this.newtasktypedlg.show();
	},
	refresh_view:function()
	{

	}

});
