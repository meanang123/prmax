//-----------------------------------------------------------------------------
// Name:    prmax.updatum.banner
// Author:  Chris Hoy
// Purpose:
// Created: 24/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.updatum.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.updatum.banner",
	[prmax.display.CommonBanner],{
		templatePath: dojo.moduleUrl( "prmax.updatum","templates/banner.html")
});