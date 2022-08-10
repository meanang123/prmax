require({cache:{
'url:research/freelance/templates/FreelanceChange.html':"<div>\r\n\t<div data-dojo-attach-point=\"freelance_change_grid_view\" data-dojo-props=\"dijit/layout/ContentPane\" data-dojo-props='region:\"top\",style:\"width:100%;height:20%\"'></div>\r\n\t<div data-dojo-attach-point=\"freelance_accept_grid_view\" data-dojo-props=\"dijit/layout/ContentPane\"  data-dojo-props='region:\"center\"'></div>\r\n</div>\r\n"}});
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
define("research/freelance/FreelanceChanges", [
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





