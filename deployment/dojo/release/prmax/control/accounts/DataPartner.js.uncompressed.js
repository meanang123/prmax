require({cache:{
'url:control/accounts/templates/DataPartner.html':"<div>\r\n\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    DataPartner.js
// Author:  
// Purpose:
// Created: 18/01/2017
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/accounts/DataPartner", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../accounts/templates/DataPartner.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dijit/form/Select",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Button",
	"dijit/form/CurrencyTextBox",
	"dijit/form/NumberTextBox",
	"dijit/Toolbar",
	"dijit/Dialog",
	"dijit/form/Form",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore,Grid,JsonRest,Observable){

return declare("control.accounts.DataPartner",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
	},

	postCreate:function()
	{
	}

});
});
