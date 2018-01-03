//-----------------------------------------------------------------------------
// Name:    "prmax.lists.view
// Author:  Chris Hoy
// Purpose:
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.view");

dojo.require("prmax.lists.standinglist");
dojo.require("prcommon.advance.listsview");
dojo.require("prmax.pressrelease.seo.view");

dojo.declare("prmax.lists.view", [ttl.BaseWidget], {
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists","templates/view.html"),
	startup_standing : 'selected:"selected"',
	startup_distributions: "",
	startup_mode:'"Display All"',
	refresh:function( showviewname , startup )
	{
		this._ShowView( showviewname ) ;
		this.standing.refresh(startup);
		this.distribution.refresh(startup);
		if ( this.advance != null )
			this.advance.refresh();

			if ( this.seo_pane != null)
				this.seo_pane.refresh();

		this.borderCtrl.resize( arguments[0] ) ;
	},
	postCreate:function()
	{
		// If advance add extra tab
		if (PRMAX.utils.settings.advancefeatures)
		{
			var pane = new dijit.layout.BorderContainer({ "data-dojo-attach-point":"advance_view", style:"width:100%;height:100%",title:"Features" }) ;
			this.advance = new prcommon.advance.listsview({"data-dojo-attach-point":"advance", region:"center"});

			pane.addChild(this.advance);
			this.tabCtrl.addChild(pane);
		}
		if (PRMAX.utils.settings.seo && PRMAX.utils.settings.no_distribution==false)
		{
			var pane = new dijit.layout.BorderContainer({ "data-dojo-attach-point":"seo_view", style:"width:100%;height:100%",title:"SEO" }) ;
			this.seo_pane = new prmax.pressrelease.seo.view({"data-dojo-attach-point":"seo", region:"center"})

			pane.addChild(this.seo_pane);
			this.tabCtrl.addChild(pane);
		}

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);
		if (PRMAX.utils.settings.no_distribution==true)
		{
			this.distributionstab_view.controlButton.domNode.style.display = "none";
		}
	},
	resize:function()
	{
		this.inherited(arguments);
	},
	_ShowView: function (showviewname )
	{
		if (showviewname == "distributions")
			this.tabCtrl.selectChild(this.distributionstab_view);
		if (showviewname == "standing")
			this.tabCtrl.selectChild(this.standingtab_view);
	}
});
