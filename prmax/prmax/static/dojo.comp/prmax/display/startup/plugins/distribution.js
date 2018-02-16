dojo.provide("prmax.display.startup.plugins.distribution");

dojo.require("dojox.widget.Portlet");
dojo.require("dojox.data.JsonRestStore");
dojo.require("prmax.pressrelease.viewfilter");

dojo.declare("prmax.display.startup.plugins.distribution",
	[ ttl.BaseWidget ],{
	templateString: dojo.cache( "prmax","display/startup/plugins/templates/distribution.html"),
	height:102,
	constructor: function()
	{
		this._liststore = new dojox.data.JsonRestStore( {target:"/emails/rest_distributions", idAttribute:"emailtemplateid"});
		this._client = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"clientid"});

		dojo.subscribe('/update/distribution_label', dojo.hitch(this,this._UpdateDistributionLabelEvent));
	},
	view: {
		cells: [[
		{name: 'Description',width: "auto",field:"emailtemplatename"},
		{name: 'Status', width: "60px", field:"status"},
		{name: 'Client',width: "150px",field:"clientname"},
		{name: 'Time Sent',width: "100px",field:"display_sent_time"},
		{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl}
		]]
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view);
		this.grid._setStore(this._liststore);
		this.clientid.set("store", this._client);
		this.grid.onRowClick = dojo.hitch(this,this._select_row);
		this.grid.onCellDblClick = dojo.hitch(this,this._dbl_click_row);

		this.clientid.set("value", -1);

		dojo.attr(this.portlet, 'title', PRMAX.utils.settings.distribution_description_plural);

		this.borderCtrl.resize( {w:400, h:this.height});

		this.inherited(arguments);
	},
	_UpdateDistributionLabelEvent:function()
	{
		dojo.attr(this.portlet, 'title', PRMAX.utils.settings.distribution_description_plural);
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

		if ( e.cellIndex == 4 && row && row.pressreleasestatusid != 2)
			this._open_list( row );

		this.grid.selection.clickSelectEvent(e);

	},
	_dbl_click_row:function(e)
	{
		var row = this.grid.getItem(e.rowIndex);

		if (row && row.pressreleasestatusid != 2)
			this._open_list( row );
	},
	correct_start_up_size:function()
	{
		var tmp = dojo.position(this.portlet.domNode, true);

		this.borderCtrl.resize( {w:tmp.w, h:this.height} ) ;
	},
	_ExecuteFilter:function()
	{
		var q_com = {};

		if (arguments[0].emailtemplatename)
			q_com["emailtemplatename"] = arguments[0].emailtemplatename;

		if (arguments[0].clientid != "-1")
			q_com["clientid"] = arguments[0].clientid;

		q_com["restriction"] = arguments[0].restriction;

		this.grid.setQuery( q_com );

	},
	_ClearFilter:function()
	{
		this.viewfilter.set("value", 2);
		this.emailtemplatename.set("value", "");
		this.clientid.set("value", -1);
	},
	_open_list:function ( data )
	{
		dojo.publish(PRCOMMON.Events.PressReleaseStart, [data]) ;
	}
});