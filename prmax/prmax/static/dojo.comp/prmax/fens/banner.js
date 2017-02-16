//-----------------------------------------------------------------------------
// Name:    prmax.fens.banner
// Author:  Chris Hoy
// Purpose:
// Created: 22/08/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.fens.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.fens.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.fens","templates/banner.html")
});