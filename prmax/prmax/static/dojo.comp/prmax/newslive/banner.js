//-----------------------------------------------------------------------------
// Name:    prmax.newslive.banner
// Author:  Chris Hoy
// Purpose:
// Created: 29/09/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.newslive.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.newslive.banner",
	[prmax.display.CommonBanner],{
		templatePath: dojo.moduleUrl( "prmax.newslive","templates/banner.html")
});