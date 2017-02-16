dojo.provide("prmax.iadmin.support.ActiveUsers");

dojo.require("ttl.BaseWidget");

dojo.declare("prmax.iadmin.support.ActiveUsers",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.iadmin.support","templates/ActiveUsers.html"),
	constructor: function()
	{
		this.activeusers_data = new prcommon.data.QueryWriteStore (
			{url:'/iadmin/activeusers',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			nocallback:true,
			urlPreventCache:true
			});
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.activeusers.set("structure", this._view);
		this.activeusers._setStore(this.activeusers_data );
		this.activeusers['onCellClick'] = dojo.hitch(this,this._OnActiveUser);

	},
	resize:function()
	{
		this.inherited(arguments);
		this.frame.resize(arguments[0] );
	},
	_UserLoggedOffCall:function( response )
	{
		if ( response.success == "OK" )
			this.activeusers_data.deleteItem(this._useractiverow);
	},

	_OnActiveUser:function (e )
	{
		if ( e.cellIndex == 3 && confirm("Log User off System") == true )
		{
			this._useractiverow = this.activeusers.getItem(e.rowIndex);

			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._UserLoggedOffCallBack,
				url:'/customers/logoff_user' ,
				content: {old_user_id:this._useractiverow.i.user_id}
			})	);
		}
	},
	_ActiveUsers_Refresh:function( )
	{
		this.activeusers.setQuery(ttl.utilities.getPreventCache());
		this._SetTime( this.activityview_time );
	},
	_SetTime:function( field )
	{
		dojo.attr( field ,"innerHTML",new Date().toString());
	},
	_view : {noscroll: false,
			cells: [[
			{name: 'Expires',width: "auto",field:'expiry'},
			{name: 'User Name',width: "auto",field:'user_name'},
			{name: 'Customer',width: "auto",field:'customername'},
			{Name: 'Logoff',width:"100px"}
		]]
		}
});