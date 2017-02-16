//-----------------------------------------------------------------------------
// Name:    prmax.display.StdBanner
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.display.StdBanner");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("prmax.search.SearchCtrl");
dojo.require("prmax.DlgCtrl2");
dojo.require("prmax.display.CommonBanner");

dojo.require("prmax.customer.CustomerInvoices");

dojo.declare("prmax.display.StdBanner",
	[prmax.display.CommonBanner],{
		widgetsInTemplate: true,
		message:"",
		showlabel:false,
		isuseradmin:false,
		canviewfinancial:false,
		templatePath: dojo.moduleUrl( "prmax.display","templates/PrmaxBanner.html")
});