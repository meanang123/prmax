dojo.provide("prmax.display.startup.plugins.prrequests");

dojo.require("dojox.widget.Portlet");
dojo.require("prmax.prrequest.view");

dojo.declare("prmax.display.startup.plugins.prrequests",
	[ ttl.BaseWidget ],{
	templateString: dojo.cache( "prmax","display/startup/plugins/templates/prrequests.html"),
	height:170,
	constructor: function()
	{
	},
	postCreate:function()
	{
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
	correct_start_up_size:function()
	{
		var tmp = dojo.position(this.portlet.domNode, true);
		var width = tmp.w - 10;

		this.borderCtrl.resize( {w:width, h:this.height} ) ;
		this.ppr_request_ctrl.grid.resize( {w:width, h:this.height} ) ;
	},
	_execute_filter:function()
	{
		var filter = {};

		var phrase = this.pprrequest.get("value");
		if (phrase.length > 0 )
			filter["phrase"] = phrase;

		this.ppr_request_ctrl.filter(filter);

	},
	_clear_filter:function()
	{
		this.pprrequest.set("value","");
	},
	_refresh:function()
	{
		this.ppr_request_ctrl.filter({});

	}
});