require({cache:{
'url:research/projects/templates/outletwizard.html':"<div></div>"}});
//-----------------------------------------------------------------------------
// Name:    outletwizard.js
// Author:  Chris Hoy
// Purpose:
// Created: 05/09/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/projects/outletwizard", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/outletwizard.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic,  lang, domattr ){
 return declare("research.projects.outletwizard",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	}
});
});





