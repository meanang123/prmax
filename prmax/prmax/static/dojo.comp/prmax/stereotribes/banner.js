//-----------------------------------------------------------------------------
// Name:    prmax.stereotribes.banner
// Author:  Chris Hoy
// Purpose:
// Created: 14/07/2016
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.stereotribes.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.stereotribes.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.stereotribes","templates/banner.html")
});
