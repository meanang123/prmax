//-----------------------------------------------------------------------------
// Name:    prmax.pressdata.banner
// Author:  Chris Hoy
// Purpose:
// Created: 14/07/2016
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressdata.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.pressdata.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.pressdata","templates/banner.html")
});
