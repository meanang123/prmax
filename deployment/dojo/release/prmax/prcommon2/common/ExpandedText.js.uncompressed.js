require({cache:{
'url:prcommon2/common/templates/ExpandedText.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='\"class\":\"reasonframe\",region:\"center\"' >\r\n\t\t<textarea data-dojo-attach-point=\"text_point\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='style:\"width:98%;height:98%\"'  ></textarea>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:34px\"' >\r\n\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:left\",type:\"button\",label:\"Close\",iconClass:\"fa fa-close\"'></button>\r\n\t\t<button data-dojo-attach-event=\"onClick:_save\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:right\",type:\"button\",label:\"Finish\"'></button>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ExpandedText
// Author:  Chris Hoy
// Purpose:
// Created: 06/03/2013
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/common/ExpandedText", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../common/templates/ExpandedText.html",
	"dijit/layout/BorderContainer",
	"dijit/form/Textarea",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer ){
 return declare("prcommon2.common.ExpandedText",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
	},
	_close:function()
	{
		this._dialog.hide();
		this.text_point.set("value", "");
	},
	_save:function()
	{
		this._ctrl.set("value", this.text_point.get("value"));
		this._dialog.hide();
		this.text_point.set("value", "");
	},
	show_control:function(ctrl, dialog,title)
	{
		this._ctrl = ctrl;
		this._dialog = dialog;
		this._dialog.set("title",title);
		this.text_point.set("value", this._ctrl.get("value"));
		this._dialog.show();
	}
});
});
