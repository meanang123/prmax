dojo.provide("prmax.iadmin.Support");

dojo.require("ttl.BaseWidget")

dojo.declare("prmax.iadmin.Support",
	[ttl.BaseWidget],{
		templatePath: dojo.moduleUrl( "prmax.iadmin","templates/Support.html"),
	constructor: function()
	{
		this.inherited(arguments);

		this.customer_model= new prcommon.data.QueryWriteStore (
			{url:'/iadmin/customers?licence_expired=1',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true,
			nocallback:true
			});

		this.user_model= new prcommon.data.QueryWriteStore (
			{url:'/iadmin/users_support',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});

		this._SetCustomerCallBack = dojo.hitch ( this , this._SetCustomerCall );
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.customers.store = this.customer_model ;
		this.users.store =  this.user_model ;
	},
	_SetCustomerCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Support Customer updated");
		}
		else
		{
			alert("Problem Updating Support Customer");
		}
	},
	_SetCustomer:function()
	{

		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			return false;
		}

		if ( confirm ( "Set Support Customer" ) )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SetCustomerCallBack,
					url:'/iadmin/support_customer_set',
					content: this.form.get("value")
			}));
		}
	}
});