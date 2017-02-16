dojo.provide("prmax.iadmin.sales.view");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.iadmin.sales.SetExpireDate");

dojo.declare("prmax.iadmin.sales.view",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.sales","templates/view.html"),
	constructor: function()
	{
		this._tasks = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/tasks?group=sales',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});

		this._row = null ;
		this._taskstatusfilter =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus&nofilter"});
		this._userfilter = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales&nofilter"});
		this._tasktypefilter =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktype&nofilter"});

		this._users = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales,accounts"});
		this._taskstatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus"});
		this._customersources =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customersources"});

		this._UpdatedCallBack = dojo.hitch ( this, this._UpdatedCall ) ;
		this._getModelItemBack = dojo.hitch ( this, this._getModelItem );
		this._LoadCustomerCall = dojo.hitch( this, this._LoadCustomer );
		this._LoadCustomerSettingCallBack = dojo.hitch ( this, this._LoadCustomerSettingCall );
		this._UpdatedSettingsCallBack = dojo.hitch (this, this._UpdatedSettingsCall );
		this._TaskCallBack = dojo.hitch( this, this._TaskCall );

		dojo.subscribe(PRCOMMON.Events.Task_Refresh, dojo.hitch(this,this._RefreshTask));
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.view_grid.set("structure", this._view);
		this.view_grid._setStore ( this._tasks );
		this.view_grid["onRowClick"] = dojo.hitch(this, this._OnSelectRow );
		this.view_grid['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);

		this.taskstatusid.store = this._taskstatus;
		this.assigntoid.store = this._users;
		this.customersourceid.store = this._customersources;

		this.taskstatusfilter.store = this._taskstatusfilter;
		this.userfilter.store = this._userfilter;
		this.tasktypefilter.store = this._tasktypefilter;
		this.taskstatusfilter.set("value",-1);
		this.userfilter.set("value",-1);
		this.tasktypefilter.set("value",-1);

		this.customertypeid.set("store", PRCOMMON.utils.stores.Customer_Types_Filter());
		this.customertypeid.set("value", -1);


	},
	_OnStyleRow:function(inRow)
	{
		var rowData = this.view_grid.getItem(inRow.index);
		if (rowData && rowData.i.isoverdue == true)
		{
			inRow.customClasses += " prmaxOverDueRow";
		}
		if (rowData && rowData.i.istoday == true)
		{
			inRow.customClasses += " prmaxCurrent";

		}


		ttl.GridHelpers.onStyleRow(inRow);
	},
	_OnSelectRow : function(e) {

		this._row = this.view_grid.getItem(e.rowIndex);

		dojo.addClass(this.updsettingsbtn.domNode,"prmaxhidden");
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCustomerSettingCallBack,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._row.i.customerid}
			}));


		this.crmviewer.LoadControls( null, null, null, this._row.i.customerid, this._row.i.taskid );
		this.icustomerid.set("value", this._row.i.customerid);
		this.taskstatusid.set("value",this._row.i.taskstatusid);
		this.emailactionstatus.set("value", this._row.i.emailactionstatusid == 5 ? true : false ) ;


		this.due_date.set("value", ttl.utilities.parseDate ( this._row.i.due_date_full) );
		dojo.attr(this.last_accessed_display,"innerHTML", this._row.i.last_login_display);

		this.assigntoid.set("value", this._row.i.userid);
		this.taskid.set("value", this._row.i.taskid);

		this.details_container.selectChild ( this.details_view );

		this.view_grid.selection.clickSelectEvent(e);

	},
	_LoadCustomerSettingCall:function(response)
	{
		if ( response.success == "OK" )
		{
			this.customersourceid.set("value", response.data.cust.customersourceid);
			dojo.removeClass(this.updsettingsbtn.domNode,"prmaxhidden");
		}
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	_ClearFilter:function()
	{
		this.taskstatusfilter.set("value",-1);
		this.userfilter.set("value",-1);
		this.tasktypefilter.set("value",-1);
		this.overdue.set("checked", false ) ;
		this.customertypeid.set("value", -1);
	},

	_view : { noscroll: false,
		cells: [[
		{name: 'Due Date',width: "60px",field:'due_date_display'},
		{name: 'Customer Name',width: "200px",field:'customername'},
		{name: 'Contact Name',width: "150px",field:'contactname'},
		{name: 'Tel.',width: "100px",field:'tel'},
		{name: 'Owner',width: "150px",field:'user_name'},
		{name: 'Status',width: "80px",field:'taskstatusdescription'},
		{name: 'Type',width: "80px",field:'tasktypedescription'},
		{name: 'Follow Up',width: "80px",field:'emailactionstatusdescription'},
		{name: 'Started',width: "60px",field:'created_display'},
		{name: 'Accessed',width: "60px",field:'last_login_display'},
		{name: 'Source',width: "80px",field:'customertypename'}
		]]
	},
	_ExecuteFilter:function()
	{
		var query = {};

		if ( arguments[0].iuserid != -1 )
			query["iuserid"] = arguments[0].iuserid;
		if (arguments[0].tasktypeid != -1 )
			query["tasktypeid"] = arguments[0].tasktypeid;
		if (arguments[0].taskstatusid != -1 )
			query["taskstatusid"] = arguments[0].taskstatusid;

		if (arguments[0].customertypeid != -1 )
			query["customertypeid"] = arguments[0].customertypeid;

		console.log ( arguments ) ;
		if ( arguments[0].overdue.length>0 )
			query["overdue"] = 1;

		this.view_grid.setQuery(ttl.utilities.getPreventCache(query));
		this.details_container.selectChild ( this.blank_view );
	},
	_SetExpire:function()
	{
		this.expirectrl.Load( this._row.i.customerid, this._row.i.taskid );
	},
	_SendConfirmation:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCustomerCall,
			url:'/iadmin/get_internal',
			content:{'icustomerid':this._row.i.customerid}
			}));
	},
	_LoadCustomer:function( response )
	{
		if ( response.success == "OK" )
		{
			this.sendorderconfirmationctrl.setCustomer (
				response.data.cust.customerid,
				this.sendorderconfirmationdialog,
				response.data.cust,
				this._row.i.taskid) ;

			this.sendorderconfirmationdialog.show();
		}
		else
		{
			alert("Problem Loading Customer Details");
		}
	},
	_UpdatedCall:function( response )
	{
		if ( response.success == "OK")
		{
			this.crmviewer.refresh ( this._row.i.taskid ) ;

			this._tasks.setValue( this._row, "tasktypedescription" , response.task.tasktypedescription, true );
			this._tasks.setValue( this._row, "taskstatusdescription" , response.task.taskstatusdescription, true );
			this._tasks.setValue( this._row, "due_date_display" , response.task.due_date_display, true );
			this._tasks.setValue( this._row, "emailactionstatusdescription", response.task.emailactionstatusdescription, true );
			this.reason.set("value","");
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
		this.updbtn.cancel();
	},
	_getModelItem:function()
	{
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_Update:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			return false;
		}

		if ( this.reason.get("value").length == 0 )
		{
			alert("Please Enter Details");
			this.updbtn.cancel();
			this.reason.focus();
			return false;
		}

		var content = this.form.get("value");

		content["due_date"] = ttl.utilities.toJsonDate ( this.due_date.get("value") ) ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._UpdatedCallBack),
			url:'/iadmin/task_update',
			content:content}));
	},
	_UpdatedSettingsCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Customer Details Updated");
		}
		else
		{
			alert("problem");
		}
	},
	_UpdateSettings:function()
	{
		if ( confirm("Update Customer Details"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdatedSettingsCallBack),
				url:'/iadmin/customer_task_settings_update',
				content:this.formsettingsupdate.get("value")}));

		}
	},
	_Refresh:function()
	{
		var query = { };

		this.view_grid.setQuery(ttl.utilities.getPreventCache(query));
		this.details_container.selectChild ( this.blank_view );

	},
	_GoToMainanence:function()
	{
		dojo.publish(PRCOMMON.Events.Show_Customer_Main, [this._row.i.customerid]);
	},
	_TaskCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.crmviewer.refresh ( this._row.i.taskid ) ;

			this._tasks.setValue( this._row, "tasktypedescription" , response.task.tasktypedescription, true );
			this._tasks.setValue( this._row, "taskstatusdescription" , response.task.taskstatusdescription, true );
			this._tasks.setValue( this._row, "due_date_display" , response.task.due_date_display, true );
			this._tasks.setValue( this._row, "emailactionstatusdescription", response.task.emailactionstatusdescription, true );
			this.reason.set("value","");

			this.taskstatusid.set("value",response.task.taskstatusid);
			this.assigntoid.set("value", response.task.userid);

		}
	},
	_RefreshTask:function()
	{
		if ( this._row )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._TaskCallBack,
				url:'/iadmin/task_get',
				content:{taskid:this._row.i.taskid}}));
		}

	}

});
