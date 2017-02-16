dojo.provide("prmax.iadmin.accounts.Diary");

dojo.require("ttl.BaseWidget");
dojo.require("prmax.iadmin.TaskAdd");

dojo.declare("prmax.iadmin.accounts.Diary",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/Diary.html"),
	constructor: function()
	{
		this._tasks = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/tasks?group=accounts',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});

		this._taskstatusfilter =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus&nofilter"});
		this._userfilter = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=accounts&nofilter"});
		this._tasktypefilter =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktype&nofilter"});
		this._tasktagfilter = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktags&group=accounts&nofilter"});


		this._users = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales,accounts"});
		this._taskstatus =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=taskstatus"});
		this._tasktags = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=tasktags&group=accounts"});


		this._UpdatedCallBack = dojo.hitch ( this, this._UpdatedCall ) ;
		this._getModelItemBack = dojo.hitch ( this, this._getModelItem );
		this._LoadCustomerCall = dojo.hitch( this, this._LoadCustomer );
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
		this.tasktagid.store = this._tasktags;


		this.taskstatusfilter.store = this._taskstatusfilter;
		this.userfilter.store = this._userfilter;
		this.tasktypefilter.store = this._tasktypefilter;
		this.tasktagfilter.store = this._tasktagfilter;

		this.taskstatusfilter.set("value",-1);
		this.userfilter.set("value",-1);
		this.tasktypefilter.set("value",-1);
		this.tasktagfilter.set("value",-1);

	},
	_OnStyleRow:function(inRow)
	{
		var rowData = this.view_grid.getItem(inRow.index);
		if (rowData && rowData.i.isoverdue == true)
		{
			inRow.customClasses += " prmaxOverDueRow";
		}

		ttl.GridHelpers.onStyleRow(inRow);
	},
	_OnSelectRow : function(e) {

		this._row = this.view_grid.getItem(e.rowIndex);

		this.crmviewer.LoadControls( null, null, null, this._row.i.customerid, this._row.i.taskid );

		this.taskstatusid.set("value",this._row.i.taskstatusid);
		this.due_date.set("value", ttl.utilities.parseDate ( this._row.i.due_date_full) );
		this.assigntoid.set("value", this._row.i.userid);
		this.taskid.set("value", this._row.i.taskid);
		this.tasktagid.set("value", this._row.i.tasktagid);
		this.reason.set("value","");

		this.details_container.selectChild ( this.details_view );

		this.view_grid.selection.clickSelectEvent(e);

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
		this.tasktagfilter.set("value", -1 ) ;
	},

	_view : { noscroll: false,
		cells: [[
		{name: ' ',width: "2em",field:'customerid'},
		{name: 'Customer Name',width: "200px",field:'customername'},
		{name: 'Contact Name',width: "150px",field:'contactname'},
		{name: 'Tel.',width: "100px",field:'tel'},
		{name: 'Owner',width: "150px",field:'user_name'},
		{name: 'Date',width: "60px",field:'due_date_display'},
		{name: 'Status',width: "80px",field:'taskstatusdescription'},
		{name: 'Type',width: "80px",field:'tasktypedescription'},
		{name: 'Diary Type',width: "80px",field:'tasktagdescription'},
		{name: 'Subject',width: "150px",field:'subject'}
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
		if (arguments[0].tasktagid != -1 )
			query["tasktagid"] = arguments[0].tasktagid;

		console.log ( arguments ) ;

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
				response.data.cust.customername,
				response.data.cust.email,
				this.sendorderconfirmationdialog,
				response.data.cust.isadvancedemo) ;

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
			this.tmp_row = null;

			var item  = {
				identity:response.task.taskid,
				onItem: this._getModelItemBack
				};

			this._tasks.fetchItemByIdentity(item);

			if ( this.tmp_row != null )
			{
				this._tasks.setValue(  this.tmp_row, "tasktypedescription" , response.task.tasktypedescription, true );
				this._tasks.setValue(  this.tmp_row, "taskstatusdescription" , response.task.taskstatusdescription, true );
				this._tasks.setValue(  this.tmp_row, "due_date_display" , response.task.due_date_display, true );
			}

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
	_NewTask:function()
	{
		this.newtaskctrl.Load ( "accounts", this.newtaskdialog, this._tasks);
		this.newtaskdialog.show();
	},
	_Refresh:function()
	{
		this.view_grid.setQuery(ttl.utilities.getPreventCache({}));
		this.details_container.selectChild ( this.blank_view );

	}
});
