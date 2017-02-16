//-----------------------------------------------------------------------------
// Name:   prmax.prrequest.view
// Author:  Chris Hoy
// Created: 23/03/2014
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.prrequest.view");

dojo.require("ttl.utilities");

function _row_image_local(profile_image_url)
{
	return "<img src='"+profile_image_url+"'></img>";
}

dojo.declare("prmax.prrequest.view",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.prrequest","templates/view.html"),
	fullview:false,
	constructor: function() {

		this.model = new prcommon.data.QueryWriteStore (
			{url:'/prrequest/list',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

		this.model.SetNoCallBackMode(true);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.grid.set("structure",[this.view1] );
		this.grid._setStore ( this.model ) ;
		this.grid['onCellClick'] = dojo.hitch(this,this._on_select_row);
	},
	_on_select_row:function(e)
	{
		var row = this.grid.getItem(e.rowIndex);

		window.open ( "https://mobile.twitter.com/"+ row.i.user_name + "/status/" + row.i.twitterid, "newWind", "alwaysRaised" ) ;
	},
	view1:
	{
		cells: [[
			{name: 'User',field:"user_name",width: "150px"},
			{name: 'Tweet',width: "auto",field:"tweet"},
			{name: 'Created',width: "auto",field:"created_display",width: "60px"},
			{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl}

			]]
	},
	set_size:function()
	{
		this.grid.resize( {w:698, h:498});
	},
	filter:function(params )
	{
		this.grid.setQuery( params );
	}
});
