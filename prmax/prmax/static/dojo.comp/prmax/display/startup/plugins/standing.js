dojo.provide("prmax.display.startup.plugins.standing");

dojo.require("dojox.widget.Portlet");
dojo.require("dojox.data.JsonRestStore");

dojo.require("prmax.lists.NewListDlg");

dojo.declare("prmax.display.startup.plugins.standing",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	height:170,
	templatePath: dojo.moduleUrl( "prmax.display.startup.plugins","templates/standing.html"),
	constructor: function()
	{

		this._liststore = new dojox.data.JsonRestStore( {target:"/lists/rest_lists_standing", idAttribute:"listid"});
		this._client = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"clientid"});

		this._open_list_call_back = dojo.hitch(this,this._open_list_call);
		this._client_added_call_back = dojo.hitch(this, this._client_added_call);

	},
	view:{
		cells: [[
			{name: 'Name',width: "auto",field:"listname"},
			{name: 'Client',width: "200px",field:"clientname"},
			{name: 'Qty',width: "50px",field:"qty"},
			{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl}
			]]
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view);
		this.grid._setStore(this._liststore);
		this.filter_clientid.set("store", this._client);
		this.grid.onRowClick = dojo.hitch(this,this._select_row);
		this.grid.onCellDblClick = dojo.hitch(this,this._dbl_click_row);

		this.filter_clientid.set("value", -1);
		this.newlistdlg.set("callback",  this._client_added_call_back);

		this.borderCtrl.resize( {w:400, h:this.height});
		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		setTimeout( dojo.hitch(this, this.correct_start_up_size), 400);
	},
	resize:function()
	{
		this.inherited(arguments);
	},
	_select_row:function(e)
	{
		var row = this.grid.getItem(e.rowIndex);

		if ( e.cellIndex == 3 && row)
			this._open_list( row.listid );

		this.grid.selection.clickSelectEvent(e);

	},
	_dbl_click_row:function(e)
	{
		var row = this.grid.getItem(e.rowIndex);

		if (row)
			this._open_list( row.listid );
	},
	_open_list:function(listid)
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._open_list_call_back,
				url:'/lists/open',
				content: {
						overwrite:1,
						lists:dojo.toJson([listid]),
						selected:-1,
						listtypeid:1}}));
	},
	_open_list_call:function( response )
	{
		dojo.publish(PRCOMMON.Events.SearchSession_Changed, [ response.data] );
		dijit.byId("std_banner_control").ShowResultList();
	},

	correct_start_up_size:function()
	{
		var tmp = dojo.position(this.portlet.domNode, true);

		console.log("RESIZE" ,  tmp)

		this.borderCtrl.resize( {w:tmp.w, h:this.height} ) ;
	},
	_ExecuteFilter:function()
	{
		var q_com = ttl.utilities.getPreventCache();

		if (arguments[0].listname)
			q_com["listname_filter"] = arguments[0].listname;

		if (arguments[0].clientid != "-1")
			q_com["clientid"] = arguments[0].clientid;

		this.grid.setQuery( q_com );

	},
	_ClearFilter:function()
	{
		this.filter_listname.set("value", "");
		this.clientid.set("value", -1);

		this.grid.setQuery( ttl.utilities.getPreventCache() );
	},
	_Add:function()
	{
		this.newlistdlg.show(0, -1, -1);
	},
	_client_added_call:function( response )
	{
		this._liststore.newItem( response.list );
	},
	_Search:function()
	{
		dijit.byId("std_banner_control").ShowSearchStd();
	}
});