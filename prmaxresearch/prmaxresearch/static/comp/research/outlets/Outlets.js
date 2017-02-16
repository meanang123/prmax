//-----------------------------------------------------------------------------
// Name:    Outlets.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/Outlets.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojox/layout/ExpandoPane",
	"research/search",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"research/outlets/OutletEdit",
	"research/freelance/FreelanceEdit",
	"research/employees/ContactInterests",
	"research/international/Edit"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, domattr){
 return declare("research.outlets.Outlets",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		topic.subscribe(PRCOMMON.Events.Display_Load, lang.hitch(this,this._load_event));
		topic.subscribe(PRCOMMON.Events.Outlet_Deleted, lang.hitch(this,this._outlet_deleted_event));
		topic.subscribe("LoadParentOutlet", lang.hitch(this, this._load_event));
		topic.subscribe("LoadChildOutlet", lang.hitch(this, this._load_event));
	},
	_load_event:function ( outletid, prmax_grouptypeid,sourcetypeid )
	{
		if (sourcetypeid != 1 && sourcetypeid != 2 && sourcetypeid != 3)
		{
			this.controls.selectChild ( this.internationaledit );
			this.internationaledit.load ( outletid );

		}
		else if ( prmax_grouptypeid == "freelance" )
		{
			this.controls.selectChild ( this.freelanceedit);
			this.freelanceedit.load ( outletid );
		}
		else
		{
			this.controls.selectChild ( this.outletedit);
			this.outletedit.load ( outletid );
		}
	},
	_outlet_deleted_event:function ( data )
	{
		this.controls.selectChild ( this.blank);
		this.freelanceedit.clear ();
		this.outletedit.clear ();
	}
});
});





