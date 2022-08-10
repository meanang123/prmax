require({cache:{
'url:prcommon2/clippings/templates/add_footer.html':"<div>\r\n    <form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n        <input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"icustomerid\" data-dojo-props='\"class\":\"prmaxhidden\", name:\"icustomerid\",type:\"text\"'/>\r\n        <table width=\"100%\" class=\"prmaxtable\" >\r\n            <tr><td align=\"right\" width=\"20%\" class=\"prmaxrowtag\"><label>Description</label></td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"emailfooterid\" data-dojo-props='required:true,name:\"emailfooterdescription\",trim:true,type:\"text\"'></td></tr>\r\n            <tr><td align=\"right\" width=\"20%\" class=\"prmaxrowtag\"><label>HTML</label></td><td><input data-dojo-type=\"dijit/form/SimpleTextarea\" data-dojo-attach-point=\"htmltext\" data-dojo-props='required:true,name:\"htmltext\",trim:true,type:\"text\",style:\"width:300px\",rows:\"10\"'></td></tr>\r\n        \r\n            <tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-event=\"onClick:_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving...\",label:\"Save\",\"class\":\"btnright\"'></button></td></tr>\r\n\r\n        </table></br></br>\r\n    </form></br></br>\r\n    \r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    ReportBuilder.js
// Author:  
// Purpose:
// Created: Sept 2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/add_footer", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/add_footer.html",
	"ttl/utilities2",
	"dojo/topic",	
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dojox/form/PasswordValidator",
	"dijit/form/SimpleTextarea"	
	],
	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore){

 return declare("prcommon2.clippings.add_footer",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
		this._save_call_back = dojo.hitch(this,this._save_call);

		this._emailfooter = new ItemFileReadStore({ url:"/common/lookups?searchtype=emailfooter"});
		this._customerid = PRMAX.utils.settings.cid;	
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.emailfooterid.set("store",this._emailfooter);		
	},
	load:function ( dialog, customerid)
	{
		this._dialog = dialog;
		this.icustomerid.set("value", customerid);
	},
	_save:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		var data = this.form.get("value");
		data["customerid"] = this._customerid;

		request.post("/emailfooter/save",
				utilities2.make_params({ data : data})).
				then(this._save_call_back);
	},
	_save_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Email Footer Added");
			this.savebtn.cancel();
			this._dialog.hide();
			topic.publish('/emailfooter/add', [response.data]);
		}
		else
		{
			alert("Problem Adding Email Footer");
		}
		this.savebtn.cancel();
	},	
	
});
});
