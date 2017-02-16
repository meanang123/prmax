//-----------------------------------------------------------------------------
// Name:    prmax.phoenixpd.banner
// Author:  Chris Hoy
// Purpose:
// Created: 22/09/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.phoenixpd.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.phoenixpd.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.phoenixpd","templates/banner.html")
});