//-----------------------------------------------------------------------------
// Name:    "prmax.lists.view
// Author:  Chris Hoy
// Purpose:
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.ai.listsview");

dojo.require("prmax.lists.standinglist");
dojo.require("prcommon.advance.listsview");

dojo.declare("prmax.ai.listsview", [ttl.BaseWidget], {
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.ai","templates/listsview.html"),
	refresh:function( showviewname )
	{
		this.standing.refresh();
		this.borderCtrl.resize( arguments[0] ) ;
	},
	_ShowView: function ( showviewname )
	{
		if (showviewname == "standing")
			this.tabCtrl.selectChild(this.standingtab_view);
	},
	postCreate:function()
	{
		// If advance add extra tab
		if (PRMAX.utils.settings.advancefeatures)
		{
			var pane = new dijit.layout.BorderContainer({ dojoAttachPoint:"advance_view", style:"width:100%;height:100%",title:"Features" }) ;
			this.advance = new prcommon.advance.listsview({dojoAttachPoint:"advance", region:"center"});

			pane.addChild(this.advance);
			this.tabCtrl.addChild(pane);
		}
		this.inherited(arguments);
	}
});
