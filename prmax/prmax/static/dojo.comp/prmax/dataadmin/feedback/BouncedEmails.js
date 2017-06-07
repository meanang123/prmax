//-----------------------------------------------------------------------------
// Name:    BouncedEmails.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/06/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.feedback.BouncedEmails");

dojo.require("prmax.dataadmin.feedback.Completed");


dojo.declare("prmax.dataadmin.feedback.BouncedEmails",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	mainViewString:"/display/outletmain?outletid=${outletid}",
	templatePath: dojo.moduleUrl( "prmax.dataadmin.feedback","templates/BouncedEmails.html"),
	constructor: function()
	{
		this.results = new prcommon.data.QueryWriteStore(
					{	url:'/dataadmin/bemails/list',
						onError:ttl.utilities.globalerrorchecker,
						nocallback:true
					});
		this._MessageLoadCallBack = dojo.hitch (this, this._MessageLoadCall );
		this._LoadCallBack = dojo.hitch(this, this._LoadCall);
		this._CompletedCallBack = dojo.hitch(this, this._CompletedCall);

		this.customer_front_id_data = new dojox.data.QueryReadStore (
			{url:'/iadmin/customers_combo',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

		dojo.subscribe(PRCOMMON.Events.BouncedEmail_Completed, dojo.hitch(this,this._CompletedEvent));
	},
	_CompletedEvent:function( bounceddistributionid )
	{
		this.results.deleteItem( this._row );
		this.Clear();
	},
	_CompletedCall:function ( responce )
	{
		if ( responce.success == "OK")
		{
			this.results.deleteItem( this._row );
			this.Clear();
			alert("Email marked as Ignored");
		}
		else
		{
			alert("Problem");
		}
	},
	Clear:function()
	{
		this.controls.selectChild( this.blank );
		this.msg_display.set("content","");
		this.msg_basic_display.set("content","");
		this.completed_dlg.hide();
	},
	postCreate:function()
	{
		this.result_grid.set("structure",this.view);
		this.result_grid._setStore(this.results );
		this.customers.set("store",this.customer_front_id_data);

		this.result_grid.onStyleRow = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
		this.result_grid.onRowClick = dojo.hitch(this,this._OnSelectRow);
		this.inherited(arguments);
	},
	_OnSelectRow : function(e)
	{
		this._row = this.result_grid.getItem(e.rowIndex);
		this._e = e;
		if ( this._e.cellIndex == 0 )
		{
			this.completed_ctrl.Load ( this._row.i.bounceddistributionid);
			this.completed_dlg.show();
		}
		else if ( this._e.cellIndex == 1 )
		{
			if ( confirm("Mark as Ignore"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
					load: this._CompletedCallBack,
					url:'/dataadmin/bemails/mark_as_ignore',
					content: {bounceddistributionid:this._row.i.bounceddistributionid}
				}));
			}
		}
		else
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url:'/dataadmin/bemails/get_and_lock',
				content: {bounceddistributionid:this._row.i.bounceddistributionid}
			}));
		}

		this.result_grid.selection.clickSelectEvent(e);

	},
	_LoadCall:function ( responce )
	{
		if ( responce.success == "OK" )
		{
			this._Load_Details();
		}
		else if ( responce.success == "LO" )
		{
			alert("This record is locked by " + responce.lock.username ) ;
			//alert("This record is locked by " + responce.lock[3] ) ;
		}
		else
		{
			alert("Problem accessing record");
		}
	},
	_Load_Details:function()
	{
		if ( this._row.i.owneroutletid != -1 || this._row.i.owneremployeeid != -1 )
		{
			this.isprivate.set("href",dojo.string.substitute(this.mainViewString,{outletid:this._row.i.outletid}));
			this.controls.selectChild ( this.isprivate );
		}
		else if ( this._row.i.prmax_outlettypeid == 42 )
		{
			this.controls.selectChild ( this.freelanceedit);
			this.freelanceedit.Load ( this._row.i.outletid );
		}
		else if ( this._row.i.prmax_outlettypeid != null )
		{
			this.controls.selectChild ( this.outletedit);
			this.outletedit.Load ( this._row.i.outletid );
		}
		else
		{
			this.controls.selectChild ( this.blank);
		}
		this.tabcont.selectChild ( this.msg_basic_display ) ;
		this.msg_basic_display.set("href",dojo.string.substitute(this.MsgBasicView,{bounceddistributionid:this._row.i.bounceddistributionid}));
		this.msg_display.set("href",dojo.string.substitute(this.MsgView,{bounceddistributionid:this._row.i.bounceddistributionid}));
	},
	MsgView:"/dataadmin/bemails/msg_display?bounceddistributionid=${bounceddistributionid}",
	MsgBasicView:"/dataadmin/bemails/msg_basic_display?bounceddistributionid=${bounceddistributionid}",
	_MessageLoadCall:function ( responce )
	{

	},
	view: {
		cells: [[
		{name: " ",width: "12px",field:"",formatter:ttl.utilities.formatRowCtrl},
		{name: " ",width: "12px",field:"",formatter:ttl.utilities.deleteRowCtrl},
		{name: 'Source',width: "65px",field:"sourcename"},
		{name: 'Date',width: "60px",field:"createdate_display"},
		{name: 'Outlet Name',width: "200px",field:"outletname"},
		{name: 'Name',width: "150px",field:"contactname"},
		{name: 'Job title',width: "150px",field:"job_title"},
		{name: 'Subject',width: "250px",field:"subject"},
		{name: 'Sent Customer',width: "150px",field:"customername"},
		{name: 'Owner',width: "150px",field:"ownercustomername"}
		]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_Refresh:function()
	{
		this._ClearFilter();
	},
	_ClearFilter:function()
	{
		this.autoreply.set("checked", false);
		this.outletname.set("value","");
		this.emailaddress.set("value","");
		this.customers.set("value",null);
		this.result_grid.setQuery( filter );
	},
	_Execute:function()
	{
		var filter = {};

		if (arguments[0].autoreply == "on")
			filter["autoreply"] = true;
		if (arguments[0].top50 == "on")
			filter["top50"] = true;
		if ( arguments[0].outletname.length > 0 )
			filter["outletname"] = arguments[0].outletname;
		if ( arguments[0].emailaddress.length > 0 )
			filter["emailaddress"] = arguments[0].emailaddress;
		if ( arguments[0].icustomerid > 0 )
			filter["icustomerid"] = arguments[0].icustomerid;

		this.result_grid.setQuery( filter );
		this.Clear();
	}
});





