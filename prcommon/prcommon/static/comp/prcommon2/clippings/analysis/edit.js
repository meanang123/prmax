//-----------------------------------------------------------------------------
// Name:    prcommon2/clippings/analysis/edit
// Author:
// Purpose:
// Created: August/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../analysis/templates/edit.html",
	"dijit/layout/BorderContainer",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/string"
	], function(declare, BaseWidgetAMD, template, BorderContainer, utilities2, topic, request, lang, string){
return declare("prcommon2.clippings.analysis.edit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._save_call_back=lang.hitch(this,this._save_call);
		topic.subscribe("/clipping/update", lang.hitch(this,this._update_clipping_event));
		this._ignore=false;
	},
	clear:function()
	{
		this.display_zone.set("content","");
		this.analysis_view_ctrl.selectChild(this.display_zone);
	},
	load:function(clippingid)
	{
		this.clear();
		this._clippingid = clippingid;
		this.display_zone.set("href",string.substitute("/clippings/analyse/analysis_clip_view_amd?clippingid=${clippingid}&${cache}",
			{clippingid:clippingid,cache:utilities2.get_prevent_cache_param()}));
	},
	_update_clipping_event:function(clipping)
	{
		if ( this._ignore==false )
			this.load(clipping.clippingid);
	},
	_save:function()
	{
		var formobj=dijit.byId("form_clip_"+ this._clippingid);

		if ( utilities2.form_validator(formobj)==false)
		{
			alert("Invalid Value");
			return;
		}
		request.post('/clippings/analyse/update',
			utilities2.make_params({ data :formobj.get("value")})).
			then(this._save_call_back);

	},
	_save_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._ignore=true;
			topic.publish("/clipping/update", response.data);
			this._ignore=false;
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_update:function()
	{

	}
});
});
