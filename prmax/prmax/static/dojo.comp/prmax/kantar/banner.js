//-----------------------------------------------------------------------------
// Name:    prmax.kantar.banner
// Author:  Chris Hoy
// Purpose:
// Created: 05/09/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.kantar.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.kantar.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.kantar","templates/banner.html")
});