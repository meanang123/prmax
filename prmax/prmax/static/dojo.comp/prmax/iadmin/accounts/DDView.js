dojo.provide("prmax.iadmin.accounts.DDView");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.accounts.DDView",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/DDView.html"),
	constructor: function()
	{
		dojo.subscribe(PRCOMMON.Events.Monthly_Payments, dojo.hitch(this,this._Monthly_Payment_Event));

		this.dd_data = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/customer_monthlies',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback: true
			});


	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.ddgrid.set("structure", this._view );

		this.ddgrid._setStore(this.dd_data);
		this.ddgrid['onCellClick'] = dojo.hitch(this,this._OnDDClick);
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},

	_DD_Refresh:function()
	{
		this.ddgrid.setQuery( dojo.mixin(ttl.utilities.getPreventCache(),{showall:this._show_all}));
	},
	_DD_Show_All:function()
	{
		this._show_all = this._show_all == 0 ? 1 : 0 ;
		this.dd_show_all.set("label", this._show_all==1? "Show All Monthlies" : "Only Not Paid");

		this.ddgrid.setQuery( dojo.mixin(ttl.utilities.getPreventCache(),{showall:this._show_all}));
	},
	_OnDDClick:function ( e )
	{
		if ( e.cellIndex == 6 )
		{
			this._row = this.ddgrid.getItem(e.rowIndex);

			if ( this._row.i.paymentmethodid == 3 )
			{
				this.monthlypaymentctrl.setCustomer (
					this._row.i.customerid,
					this._row.i.customername,
					this._row.i.email ,
					this.monthlypaymentdialog,
					this._row.i.pay_monthly_value) ;

				this.monthlypaymentdialog.show();
			}
			else
			{
				this.ddpaymentctrl.setCustomer (
					this._row.i.customerid,
					this._row.i.customername,
					this._row.i.email ,
					this.ddpaymentdialog,
					this._row.i.pay_monthly_value) ;

				this.ddpaymentdialog.show();

			}
		}
	},
	_Monthly_Payment_Event:function( data )
	{
			this.dd_data.setValue(  this._row, "last_paid_display", data.last_paid_display, true );
	},
	_view : {noscroll: false,
			cells: [[
			{name: 'Name',width: "30em",field:'customername'},
			{name: 'Payment Method',width: "12em",field:'paymentmethodname'},
			{name: 'Financial Status',width: "12em",field:'financialstatusdescription'},
			{name: 'Expire Date',width: "7em",field:'licence_expire'},
			{name: 'Last Paid',width: "10em",field:'last_paid_display'},
			{name: 'Payment (Ex Vat)',width: "8em",field:'pay_monthly_value', styles: 'text-align: right;' },
			{name: ' ',width: "2em",formatter:ttl.utilities.formatRowCtrl}
		]]
		}
});