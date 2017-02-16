//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/07/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.tasks.add");

dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("ttl.BaseWidget");
dojo.require("prcommon.crm.tasks.addtype")

dojo.declare("prcommon.crm.tasks.add",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.tasks","templates/add.html"),
	constructor: function()
	{
		this._users = new dojo.data.ItemFileReadStore ( { url:"/crm/tasks/customer_users"});
		this._taskstatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus"});
		this._tasktype = new prcommon.data.QueryWriteStore({url:"/common/lookups_restricted?searchtype=tasktype&show_active=1"});
			
		dojo.subscribe("tasktype/add", dojo.hitch(this,this._add_tasktype_event));
	
		this._add_call_back = dojo.hitch(this, this._add_call);
		this._dialog = null;

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.taskstatusid.store = this._taskstatus;
		this.assigntoid.store = this._users;
		this.tasktypeid.store = this._tasktype;
		this.taskstatusid.set("value","1");
		this.assigntoid.set("value",PRMAX.utils.settings.uid);
		this.tasktypeid.set("value",5);
		this.due_date.set("value",null);
	},
	load:function ( dialog )
	{
		this._dialog = dialog;
		this._clear();
	},
	_close:function()
	{
		if (this._dialog != null )
			this._dialog.hide();
	},
	_add_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Task_Add , [response.data ]);
			this._close();
			this._clear();
		}
		else
		{
			alert("Problem Adding Task");
		}
		this.addbtn.cancel();
	},
	_clear:function()
	{
		this.addbtn.cancel();
		this.taskstatusid.set("value","1");
		this.assigntoid.set("value",PRMAX.utils.settings.uid);
		this.tasktypeid.set("value",5);
		this.due_date.set("value",null);
		this.description.set("value","");
	},
	_add:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		var content = this.form.get("value");
		content["due_date"] = ttl.utilities.toJsonDate ( this.due_date.get("value") ) ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._add_call_back),
			url:'/crm/tasks/task_add',
			content: content}));
	},
	_addtype:function()
	{
		this.newtasktypectrl.load ( this.newtasktypedlg) ;
		this.newtasktypedlg.show();	
	},
	_add_tasktype_event:function( tasktype)
	{
		tasktype.id = tasktype.tasktypeid;
		tasktype.name = tasktype.tasktypedescription;
		this._tasktype.newItem(tasktype);
		this.tasktypeid.set("value", tasktype.tasktypeid);
	}
});
