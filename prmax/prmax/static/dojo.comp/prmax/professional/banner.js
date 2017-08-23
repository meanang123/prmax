//-----------------------------------------------------------------------------
// Name:    prmax.professional.banner
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.professional.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");
dojo.require("prcommon.crm.tasks.viewer");
dojo.require("prmax.pressrelease.distributiontemplate.viewer");
dojo.require("prmax.prrequest.viewer");
dojo.require("prcommon.clippings.questions.globalsetup");

dojo.declare("prmax.professional.banner",
	[ prmax.display.CommonBanner ],
	{
	templatePath: dojo.moduleUrl( "prmax.professional","templates/banner.html"),
	_show_start_up:function()
	{
		this.loadLinks();
		var page = this.mainpanel.getPage("std_start_view");
		if ( this.page !== null )
			this.mainpanel.showPage(page);
	},
	show_coverage:function()
	{
		this._Updatum();
	},
	show_tasks:function()
	{
		this.loadLinks();
		var args =
			{
				key:"tasks.html",
				href:"/layout/tasks",
				style:"width:100%;height:100%"
			};

		var page = this.mainpanel.getPage("tasks.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
			dijit.byId("tasks_view_id").refresh_view();
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_show_clippings:function()
	{
		this.loadLinks();
		var args =
			{
				key:"clippings.html",
				href:"/clippings/open_clipping_view",
				style:"width:100%;height:100%;padding:0px;margin:0px;overflow:hidden;"
			};

		var page = this.mainpanel.getPage("clippings.html");
		if (page==null)
		{
			page = this.mainpanel.addPage ( args ) ;
			ttl.utilities.resize ( page ) ;
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
});
