//-----------------------------------------------------------------------------
// Name:    prmax.display.StdBanner
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.ai.banner");


dojo.require("prmax.ai.listsview");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");


dojo.declare("prmax.ai.banner",
	[prmax.display.CommonBanner],{
		templatePath: dojo.moduleUrl( "prmax.ai","templates/banner.html")
});