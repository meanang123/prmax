dojo.provide("prmax.iadmin.support.FrontScreen");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.support.FrontScreen",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.support","templates/FrontScreen.html"),
	constructor: function()
	{
		this._LoadFrontPageCall = dojo.hitch(this,this._LoadFrontPage);
		this._UpdateFrontPageResponseCall = dojo.hitch(this,this._UpdateFrontPageResponse);

		this.customer_front_id_data = new dojox.data.QueryReadStore (
			{url:'/iadmin/customers_combo',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.customer_front_id.store = this.customer_front_id_data;
		this.customer_front_id.set("value","-1");
		this._GetFrontPage(-1);
	},
	_UpdateFrontScreen:function()
	{
		if ( confirm("Update Front Screen"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdateFrontPageResponseCall),
				url:'/iadmin/update_front_page',
				content:{'icustomerid':this.customer_front_id.get("value"),
							info: this.front_page.get("value")}
					}));
		}
	},
	_UpdateFrontPageResponse:function ( response )
	{
		if ( response.success=="OK")
			alert("Front Page Updated");
		else
			alert("Problem Updating front page");
	},
	_GetFrontPage:function ( customerid )
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: dojo.hitch(this,this._LoadFrontPageCall),
			url:'/iadmin/get_front_page',
			content:{'icustomerid': customerid}
			}));
	},
	_LoadFrontPageChange:function ()
	{
		if ( this.front_customerid != arguments[0] )
		{
			this.front_customerid = arguments[0];
			this._GetFrontPage ( this.front_customerid ) ;
		}
	},
	_PreviewFrontScreen:function()
	{

	},
	_LoadFrontPage:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.front_page.set("value", response.info);
		}
		else
		{
			alert("Problem Loading Front Page");
		}
	}
});