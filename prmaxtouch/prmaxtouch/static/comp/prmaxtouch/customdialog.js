//-----------------------------------------------------------------------------
// Name:    customdialog.js
// Author:  Seb Holt
//
// Purpose: Custom dialog for errors, confirmation and information messages
//
// Created: 05/08/2014
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../prmaxtouch/templates/customdialog.html",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/Dialog",
	"dijit/TooltipDialog"
	],
	function(declare, BaseWidgetAMD, template, lang, domattr, domclass, topic){

 return declare("prmaxtouch.customdialog",
	[BaseWidgetAMD],{
	templateString:template,
	response:"",
	def_title:'PRmax',
	def_message:'',
	def_option:'yesno',
	flashtimer:null,
	flash:false,
	constructor: function(settings){
	},

	error:function(settings)
	{
		this.def_title = "Error";
		this.def_message = "An unexpected error has occurred.";
		this.def_options = "ok";
		this.show(settings);
	},

	confirm:function(settings)
	{
		this.def_title = "Confirmation";
		this.def_message = "Are you sure you wish to continue?";
		this.def_options = "yesno";
		this.show(settings);
	},

	info:function(settings)
	{
		this.def_title = "Information";
		this.def_message = "The process is complete.";
		this.def_options = "ok";
		this.show(settings);
	},

	show:function(settings)
	{
		this.nobtn.disabled = false;
		this.yesbtn.disabled = false;
		this.revnobtn.disabled = false;
		this.revyesbtn.disabled = false;
		this.okbtn.disabled = false;
		domclass.add(this.custom_dialog.closeButtonNode,"pprhidden");

		if (!settings.options)
			settings.options = this.def_options;

		if (!settings.title)
			settings.title = this.def_title;

		if (!settings.message)
			settings.message = this.def_message;

		domclass.add(this.nopanel, "pprhidden");
		domclass.add(this.yespanel, "pprhidden");
		domclass.add(this.revnopanel, "pprhidden");
		domclass.add(this.revyespanel, "pprhidden");
		domclass.add(this.okpanel, "pprhidden");

		var nobtn = this.nopanel;
		var yesbtn = this.yespanel;

		clearInterval(this.flashtimer);
		flash = false;
		domclass.remove(this.message, "dialog-message-important");
		domclass.remove(this.custom_dialog.domNode, "dialog-flash");

		if (settings.important)
		{
			domclass.add(this.message, "dialog-message-important");
			nobtn = this.revnopanel;
			yesbtn = this.revyespanel;
			this.flashtimer = setInterval(lang.hitch(this, this._flash), 350);
		}

		if (settings.options == "ok")
		{
			// show OK button only - typically for information or error dialogs
			this.header.colspan = 1;
			domclass.remove(this.okpanel, "pprhidden");
		}

		if (settings.options == "yesno")
		{
			// show Yes and No buttons - typically for confirmation dialogs
			this.header.colspan = 3;
			domclass.remove(nobtn, "pprhidden");
			domclass.remove(yesbtn, "pprhidden");
		}

		this.custom_dialog.set("title", settings.title);
		domattr.set(this.header, "innerHTML", settings.title);
		domattr.set(this.message, "innerHTML", settings.message);

		if (settings.topic)
			this.response = settings.topic;
		else
			this.response = "";

		this.custom_dialog.resize();
		this.custom_dialog.show();
		document.activeElement.blur();
	},

	hide:function(settings)
	{
		this.custom_dialog.hide();
	},

	_getNo:function()
	{
		this.nobtn.disabled = "disabled";
		this.yesbtn.disabled = "disabled";
		this.revnobtn.disabled = "disabled";
		this.revyesbtn.disabled = "disabled";
		this.okbtn.disabled = "disabled";
		this.custom_dialog.hide();
		if (this.response != "")
			topic.publish(this.response,"no");
	},

	_getYes:function()
	{
		this.nobtn.disabled = "disabled";
		this.yesbtn.disabled = "disabled";
		this.revnobtn.disabled = "disabled";
		this.revyesbtn.disabled = "disabled";
		this.okbtn.disabled = "disabled";
		this.custom_dialog.hide();
		if (this.response != "")
			topic.publish(this.response,"yes");
	},

	_flash:function()
	{
		if (this.flash)
		{
			this.flash = false;
			domclass.remove(this.custom_dialog.domNode, "dialog-flash");
		}
		else
		{
			this.flash = true;
			domclass.add(this.custom_dialog.domNode, "dialog-flash");
		}
	}

});
});
