dojo.provide("prmax.iadmin.sales.DemoRequestView");



dojo.require("prmax.iadmin.sales.DemoAddCustomer");
dojo.require("ttl.BaseWidget");


dojo.declare("prmax.iadmin.sales.DemoRequestView",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.sales","templates/DemoRequestView.html"),
	constructor: function()
	{

		this._DemoToCustomerResponseCall = dojo.hitch(this,this._DemoToCustomerResponse);
		this._DemoDeleteResponseCall = dojo.hitch(this,this._DemoDeleteResponse);

		this.demo_request_data = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/demorequests',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});

	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.demorequestview.set("structure", this._view);
		this.demorequestview._setStore(this.demo_request_data );
		this.demorequestview['onRowClick'] = dojo.hitch(this,this._OnSelectDemoRequest);
		this.demorequestview['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_SetTime:function( field )
	{
		dojo.attr( field ,"innerHTML",new Date().toString());
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		this.inherited(arguments);
	},
	_RefreshDemoRequest:function()
	{
		this.demorequestview.setQuery(ttl.utilities.getPreventCache());
		this._SetTime(this.demorequests_time);
	},
	_OnSelectDemoRequest:function( e )
	{
		this._demorow = this.demorequestview.getItem(e.rowIndex);
		dojo.removeClass(this.demo_options_view, "prmaxhidden");
		this.demorequestview.selection.clickSelectEvent(e);
	},
	_view : { noscroll: false,
		cells: [[
		{name: 'Source',width: "auto",field:'customertypename'},
		{name: 'Customer Name',width: "auto",field:'customername'},
		{name: 'Contact Name',width: "auto",field:'contactname'},
		{name: 'Email',width: "auto",field:'email'},
		{name: 'Address1',width: "auto",field:'address1'},
		{name: 'Town',width: "auto",field:'townname'},
		{name: 'PostCode',width: "auto",field:'postcode'},
		{name: 'Telephone',width: "auto",field:'telephone'}
		]]
	},
	_DeleteDemoRow:function()
	{
		this.demo_request_data.deleteItem(this._demorow);
		this.demorequestview.selection.clear();
		dojo.addClass(this.demo_options_view, "prmaxhidden");
	},
	_DemoToCustomerResponse:function ( response )
	{
		if ( response.success=="OK")
		{
			alert ( "Customer Added");
			this._DeleteDemoRow();
		}
		else if ( response.success=="DU")
		{
			alert ( "Customer Allready exists");
		}
		else
		{
			alert ( "Problem converting demo to customer");
		}
		this.demo_to_customer_email.cancel();
		this.demo_to_customer.cancel();
	},
	_DemoToCustomerEmail:function()
	{
		this.sendctrl.Load ( this._demorow.i , true , this ) ;
	},
	_DemoToCustomer:function()
	{
		this.sendctrl.Load ( this._demorow.i , false , this ) ;
	},
	_DemoDeleteResponse:function ( response )
	{
		if ( response.success=="OK")
		{
			alert ( "Demo Request Deleted");
			this._DeleteDemoRow();
		}
		this.demo_delete.cancel();
	},
	_DemoDelete:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._DemoDeleteResponseCall,
			url:'/iadmin/delete_demo',
			content:{demorequestid:this._demorow.i.demorequestid}}));
	}
});