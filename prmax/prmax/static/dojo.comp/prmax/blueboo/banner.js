//-----------------------------------------------------------------------------
// Name:    prmax.blueboo.banner
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.blueboo.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.blueboo.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.blueboo","templates/banner.html")
});