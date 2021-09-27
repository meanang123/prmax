//-----------------------------------------------------------------------------
// Name:    prmax.pressoffice.banner
// Author:  Stamatia Vatsi
// Purpose:
// Created: Nov 2019
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressoffice.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.pressoffice.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.pressoffice","templates/banner.html")
});
