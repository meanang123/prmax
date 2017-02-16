//-----------------------------------------------------------------------------
// Name:    update.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/08/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.tasks.update");

dojo.declare("prcommon.crm.tasks.update",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.tasks","templates/update.html"),
	history_view:"/crm/tasks/task_source_view?taskid=${taskid}",

	constructor: function()
	{
		this._load_call_back = dojo.hitch( this, this._load_call);
		this._upd_call_back =  dojo.hitch( this, this._upd_call);

		this._users = new dojo.data.ItemFileReadStore ( { url:"/crm/tasks/customer_users"});
		this._taskstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus"});
		this._tasktype = new dojo.data.ItemFileWriteStore ( { url:"/common/lookups_restricted?searchtype=tasktypes"});
		
		dojo.subscribe("tasktype/add", dojo.hitch(this,this._add_tasktype_event));		
		dojo.subscribe("tasktype/update", dojo.hitch(this,this._update_tasktype_event));		

	},
	postCreate:function()
	{
		this.taskstatusid.store = this._taskstatus;
		this.assigntoid.store = this._users;
		this.tasktypeid.store = this._tasktype;

		this.inherited(arguments);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.display_view.selectChild(this.tabcont);
			this.taskstatusid.set("value", response.data.taskstatusid);
			this.assigntoid.set("value", response.data.assigntoid);
			this.tasktypeid.set("value", response.data.tasktypeid);
			this.due_date.set("value", ttl.utilities.fromObjectDate(response.data.due_date));
			this.description.set("value", response.data.description);
			this.source.set("href",dojo.string.substitute(this.history_view,{taskid:response.data.taskid}));
			this.contact.set("value", response.data.contactname);
			this.outlet.set("value", response.data.outletname);
			this.outcome.set("value", response.data.outcome);
		}
		else
		{
			alert("Problem Loading Task");
		}
	},
	_clear:function()
	{
		this.display_view.selectChild(this.blank);
		this.source.set("content","");
		this.updbtn.cancel();
	},
	clear:function()
	{
		this._clear();
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	load:function(taskid)
	{
		this.clear();
		this._taskid = taskid;
		this.taskid.set("value", taskid);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._load_call_back,
						url:"/crm/tasks/task_get" ,
						content: {taskid:taskid}
						}));
	},
	_update_task:function()
	{
		if (ttl.utilities.formValidator( this.form_update ) == false )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			return false;
		}

		var content = this.form_update.get("value");
		content["due_date"] = ttl.utilities.toJsonDate ( this.due_date.get("value") ) ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._upd_call_back),
			url:'/crm/tasks/task_update',
			content: content}));

	},
	_upd_call:function(response)
	{
		if ( response.success == "OK" )
		{
			dojo.publish ( PRCOMMON.Events.Task_Update , [response.data ]);
		}
		else
		{
			alert("Problem Updating Task");
		}

		this.updbtn.cancel();
	},
	_add_tasktype_event:function( tasktype)
	{
		this._tasktype.newItem(tasktype);
	},
	_update_tasktype_event:function( tasktype)
	{
		this._tasktype_item = tasktype;
		this._tasktype.fetchItemByIdentity({
			identity: tasktype.tasktypeid,
			onItem: dojo.hitch(this,this._update_task_item)
		});
	},
	_update_task_item:function(item)
	{
		this._tasktype.setValue(item, "name", this._tasktype_item.tasktypedescription);
	}
});





