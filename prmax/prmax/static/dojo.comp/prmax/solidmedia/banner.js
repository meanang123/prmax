//-----------------------------------------------------------------------------
// Name:    prmax.solidmedia.banner
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.solidmedia.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.require("prmax.solidmedia.monitoring");
dojo.require("prcommon.crm.tasks.viewer");

dojo.declare("prmax.solidmedia.banner",
	[ prmax.display.CommonBanner ],
	{
	templatePath: dojo.moduleUrl( "prmax.solidmedia","templates/banner.html"),
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
		}
		else
		{
			this.mainpanel.showPage(page);
		}
	},
	_help_sr:function()
	{
		ttl.utilities.openPage("/static/pdf/sr_help.pdf");
	},
	_Logout2:function()
	{
		if (confirm("Logout?")==true)
			window.location.href = "/logout";
	}
});
