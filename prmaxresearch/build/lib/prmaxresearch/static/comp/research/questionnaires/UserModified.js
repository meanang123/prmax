//-----------------------------------------------------------------------------
// Name:    prmax.dataadmin.questionnaires.UserModified.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/12/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/UserModified.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",
	"dojo/dom-class"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic, domattr ,domclass){
 return declare("research.questionnaires.UserModified",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._user_data = null;
		this._research_data = null;
		this._parent_control = null;
		this._mode =0;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function(  user_data, research_data, parent_control )
	{
		this._parent_control = parent_control;
		this._parent_control.set("value",user_data);
		this._user_data = user_data;
		this._research_data = research_data;
		this._mode = 0;
		domclass.remove(this.change_view,"prmaxhidden");
	},
	clear:function()
	{
		domclass.add(this.change_view,"prmaxhidden");
		domattr.set(this.change_view,"src","prcommon/images/view_emphasised.png");
		this._user_data = null;
		this._research_data = null;
		this._mode =0;
	},
	_swap_data_view:function()
	{
		if (this._mode == 0 )
		{
			domattr.set(this.change_view,"src","prcommon/images/view.png");
			this._parent_control.set("value",this._research_data);
			this._mode = 1;
		}
		else
		{
			domattr.set(this.change_view,"src","prcommon/images/view_emphasised.png");
			this._parent_control.set("value",this._user_data);
			this._mode = 0;
		}
	}
});
});





