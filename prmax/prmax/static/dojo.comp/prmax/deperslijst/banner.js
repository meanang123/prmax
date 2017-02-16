//-----------------------------------------------------------------------------
// Name:    prmax.deperslijst.banner
// Author:  Chris Hoy
// Purpose:
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.deperslijst.banner");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.declare("prmax.deperslijst.banner",
	[ prmax.display.CommonBanner ],
	{
		templatePath: dojo.moduleUrl( "prmax.deperslijst","templates/banner.html")
});
