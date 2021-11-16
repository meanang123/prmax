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

dojo.require("prcommon.crm.update");

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
		this._allusers = new dojo.data.ItemFileReadStore ( { url:"/user/user_list"});
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._taskstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus"});
		this._tasktype = new dojo.data.ItemFileWriteStore ( { url:"/common/lookups_restricted?searchtype=tasktypes"});
		
		this._issues = new dojox.data.QueryReadStore (
			{url:'/crm/issues/issues_list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true});

		dojo.subscribe("tasktype/add", dojo.hitch(this,this._add_tasktype_event));
		dojo.subscribe("tasktype/update", dojo.hitch(this,this._update_tasktype_event));
		dojo.subscribe("/crm/update_person", dojo.hitch(this, this._update_person_event));

	},
	postCreate:function()
	{
		this.taskstatusid.store = this._taskstatus;
		this.assigntoid.store = this._users;
		this.tasktypeid.store = this._tasktype;
		this.issueid.store = this._issues;
		this.clientid.set("store", this._clients);
		this.taken_by.store = this._allusers;


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
			this.taken.set("value", ttl.utilities.fromObjectDate(response.taken_display));
			this.taken_by.set("value", response.data.taken_by);
			this.description.set("value", response.data.description);
			this.clientid.set("value", response.data.clientid);
			this.issueid.set("value", response.data.issueid);
			this._setup_view(response.data.contacthistoryid);
			this.outcome.value = response.data.outcome;
			if (response.data.contacthistoryid != null)
			{
				this.ch_update.load(response.data.contacthistoryid);
				this.source_view.selectChild(this.ch_update);
				this.tabcont.selectChild(this.source_view);
			}
			else
			{
				this.source.set("href",dojo.string.substitute(this.history_view,{taskid:response.data.taskid}));
				this.source_view.selectChild(this.source);
				this.tabcont.selectChild(this.details);
			}
			
			
			var display = response.data.contactname;
			//if (response.data.outlet == null || response.data.outlet.outletid == "")
			//{
			//	this.outletid.set("value", -1);
			//}
			//else
			//{
			//	this.outletid.set("value", response.data.outlet.outletid);
				this.contact_task.outletid.set("value", response.data.outletid);
			//}
			//if (response.data.employee == null || response.data.employee.employeeid == "")
			//{
			//	this.employeeid.set("value", -1);
			//}
			//else
			//{
			//	this.employeeid.set("value", response.data.employee.employeeid);
				this.contact_task.employeeid.set("value", response.data.employeeid);
			//}
			if (response.data.outlet != null && response.data.outlet.outletname != "")
			{
				if (display != null && display != "")
					display +="<br /><br />" + response.data.outlet.outletname;
				else
					display = " Outlet: " + response.data.outlet.outletname;
			}
			if (response.data.contact)
			{
				this.contact_task.set("value", response.data.contact.contactid);
			}
			this.contact_task.set("Displayvalue", display);
			this.contact_task.set("Mode", "info");

			
			
			
			//this.contact.set("value", response.data.contactname);
			//this.outlet.set("value", response.data.outletname);
			//this.outcome.set("value", response.data.outcome);
		}
		else
		{
			alert("Problem Loading Task");
		}
	},
	_setup_view:function(contacthistoryid)
	{
	var display = "";

		if ( contacthistoryid == null )
		{
			display = "none";
		}

		this.source_view.controlButton.domNode.style.display = display;

	},
	_clear:function()
	{
		this.display_view.selectChild(this.blank);
		this.source.set("content","");
		this.ch_update._clear();
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
		if (ttl.utilities.formValidator( this.form_taskupdate ) == false )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			return false;
		}

		var content = this.form_taskupdate.get("value");
		content["due_date"] = ttl.utilities.toJsonDate ( this.due_date.get("value") ) ;
		content["description"] = this.description.get("value");
		content["outcome"] = this.outcome.value;

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
	},
	
	_update_person_event:function(response)
	{
		if (response.outletid)
		{
			this.contact_task.outletid.set("value", response.outletid);
		//}else{
		//	this.contact.outletid.set("value", response.outlet.outletid);
		}
		if (response.employeeid)
		{
			this.contact_task.employeeid.set("value", response.employeeid);
		//}else{
		//	this.contact.employeeid.set("value", response.employee.employeeid);
		}
		

		
		if (response.outlet && response.employee)
		{
			var display = response.contactname;
			this.contact_task.outletid.set("value", response.outlet.outletid);
			this.contact_task.employeeid.set("value", response.employee.employeeid);
			if (response.outlet != null && response.outlet.outletname != "")
			{
				if (display != null && display != "")
					display +="<br /><br />" + response.outlet.outletname;
				else
					display = " Outlet: " + response.outlet.outletname;
			}
			if (response.contact)
			{
				this.contact_task.set("value", response.contact.contactid);
			}
			this.contact_task.set("Displayvalue", display);
			this.contact_task.set("Mode", "info");
		
		}


	},
});





