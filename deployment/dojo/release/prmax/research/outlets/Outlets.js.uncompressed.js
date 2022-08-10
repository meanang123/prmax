require({cache:{
'url:research/outlets/templates/Outlets.html':"<div>\r\n\t<div  data-dojo-attach-point=\"expframe\"  data-dojo-type=\"dojox/layout/ExpandoPane\" data-dojo-props='title:\"Results\",region:\"left\",style:\"width:50%;height:100%;overflow: hidden;border:1px solid black\",splitter:true'>\r\n\t\t<div data-dojo-type=\"research/search\" data-dojo-props='style:\"width:100%;height:100%\",gutters:false'></div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"center\",splitter:true,gutters:false'>\r\n\t\t<div data-dojo-props='title:\"blank\"' data-dojo-attach-point=\"blank\" data-dojo-type=\"dijit/layout/ContentPane\"></div>\r\n\t\t<div data-dojo-props='style:\"width:100%;height:100%;border:1px solid black\",title:\"outlet\"' data-dojo-attach-point=\"outletedit\" data-dojo-type=\"research/outlets/OutletEdit\" ></div>\r\n\t\t<div data-dojo-props='title:\"freelance\",style:\"width:100%;height:100%;border:1px solid black\"' data-dojo-attach-point=\"freelanceedit\" data-dojo-type=\"research/freelance/FreelanceEdit\" ></div>\r\n\t\t<div data-dojo-props='title:\"internaltional\",style:\"width:100%;height:100%;border:1px solid black\"' data-dojo-attach-point=\"internationaledit\" data-dojo-type=\"research/international/Edit\" ></div>\r\n\t</div>\r\n</div>\r\n"}});
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
define("research/outlets/Outlets", [
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





