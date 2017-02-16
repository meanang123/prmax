//-----------------------------------------------------------------------------
// Name:    prmax.levelcert.banner
// Author:  Chris Hoy
// Purpose:
// Created: 19/10/2015
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.levelcert.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.levelcert.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.levelcert","templates/banner.html")
});
