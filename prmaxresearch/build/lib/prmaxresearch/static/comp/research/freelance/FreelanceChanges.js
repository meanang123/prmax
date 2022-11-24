//-----------------------------------------------------------------------------
// Name:    geographicals.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../freelance/templates/FreelanceChange.html",
	"dijit/layout/BorderContainer"
	], function(declare, BaseWidgetAMD, template, BorderContainer){
 return declare("research.freelance.FreelanceChange",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
	},
	postCreate:function()
	{
			this.inherited(arguments);
		}
});
});





