//-----------------------------------------------------------------------------
// Name:    Interests.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.outlets.Outlets");

dojo.require("prmax.dataadmin.outlets.OutletEdit");

dojo.declare("prmax.dataadmin.outlets.Outlets",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/Outlets.html"),
	constructor: function()
	{
		dojo.subscribe(PRCOMMON.Events.Display_Load, dojo.hitch(this,this._LoadEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Deleted, dojo.hitch(this,this._OutletDeletedEvent));
	},
	resize:function()
	{
		this.inherited(arguments);
		this.frame.resize(arguments[0]);
	},
	destroy:function()
	{
		try
		{
			this.inherited(arguments);
		}
		catch(e){alert(e);}
	},
	_LoadEvent:function ( outletid, prmax_grouptypeid )
	{
		if ( prmax_grouptypeid == "freelance" )
		{
			this.controls.selectChild ( this.freelanceedit);
			this.freelanceedit.Load ( outletid );
		}
		else
		{
			this.controls.selectChild ( this.outletedit);
			this.outletedit.Load ( outletid );
		}
	},
	_OutletDeletedEvent:function ( data )
	{
		this.controls.selectChild ( this.blank);
		this.freelanceedit.Clear ();
		this.outletedit.Clear ();
	}
});





