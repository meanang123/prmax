require({cache:{
'url:prcommon2/clippings/templates/emails.html':"<div>\r\n    <form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"onSubmit\":\"return false\"'>\r\n        <table width=\"100%\" class=\"prmaxtable\" >\r\n            <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>Subject</label></td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"emailsubject\" data-dojo-props='placeHolder:\"Enter Email Subject\",required:true,name:\"emailsubject\",trim:true,type:\"text\",style:\"width:300px\"'></td></tr>\r\n            <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>From</label></td><td><span><select data-dojo-props='name:\"fromemailaddress\",autoComplete:true,labelType:\"html\", style:\"width:300px\",required:true,placeHolder:\"Select from email\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"customeremailserverid\" ></select></span>\r\n            <span style=\"margin-left:10px\"><button data-dojo-attach-event=\"onClick:_add_server\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"' >Add</button><br/></span>\r\n            </td></tr>\r\n            <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>To</label></td><td><input data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-attach-point=\"toemailaddress\" data-dojo-props='placeHolder:\"Enter Email Address\",required:true,name:\"toemailaddress\",trim:true,type:\"text\",style:\"width:300px\"'></td></tr>\r\n            <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>Header</label></td><td><span><select data-dojo-props='name:\"emailheaderid\",autoComplete:true,labelType:\"html\",style:\"width:300px\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"emailheaderid\" ></select></span>\r\n            <span style=\"margin-left:10px\"><button data-dojo-attach-event=\"onClick:_add_header\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"' >Add</button><br/></span>\r\n            </td></tr>\r\n            <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>Footer</label></td><td><span><select data-dojo-props='name:\"emailfooterid\",autoComplete:true,labelType:\"html\",style:\"width:300px\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"emailfooterid\" ></select></span>\r\n            <span style=\"margin-left:10px\"><button data-dojo-attach-event=\"onClick:_add_footer\" data-dojo-type=\"dijit.form.Button\" data-dojo-props='type:\"button\",\"class\":\"prmaxdefault\"' >Add</button><br/></span>\r\n            </td></tr>\r\n            <tr><td align=\"right\" width=\"15%\" class=\"prmaxrowtag\"><label>Layout</label></td><td><span><select data-dojo-props='name:\"emaillayoutid\",autoComplete:true,labelType:\"html\",style:\"width:300px\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"emaillayoutid\" ></select></span>\r\n            </td></tr>\r\n            <tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-event=\"onClick:_send\" data-dojo-attach-point=\"sendbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-envelope-o fa-2x\",type:\"button\",busyLabel:\"Please Wait Sending...\",label:\"Send\",\"class\":\"btnright\"'></button></td></tr>\r\n        </table></br></br>\r\n    </form>\r\n    <div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"add_server_dialog\" data-dojo-props='title:\"Add Email Server\"'>\r\n        <div data-dojo-type=\"prcommon2.clippings.add_server\" data-dojo-props='style:\"width:500px;height:240px\"' data-dojo-attach-point=\"add_server_ctrl\"></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"add_header_dialog\" data-dojo-props='title:\"Add Email Header\",style:\"width:400px;height:300px\"'>\r\n        <div data-dojo-type=\"prcommon2.clippings.add_header\" data-dojo-attach-point=\"add_header_ctrl\"></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"add_footer_dialog\" data-dojo-props='title:\"Add Email Footer\",style:\"width:400px;height:300px\"'>\r\n        <div data-dojo-type=\"prcommon2.clippings.add_footer\" data-dojo-attach-point=\"add_footer_ctrl\"></div>\r\n    </div>\r\n    <div data-dojo-type=\"dijit.Dialog\" data-dojo-attach-point=\"add_layout_dialog\" data-dojo-props='title:\"Add Email Layout\",style:\"width:300px;height:100px\"'>\r\n        <div data-dojo-type=\"prcommon2.clippings.add_layout\" data-dojo-attach-point=\"add_layout_ctrl\"></div>\r\n\r\n    </div>\r\n\r\n</div>\r\n\r\n"}});
//-----------------------------------------------------------------------------
// Name:    emails.js
// Author:  
// Purpose:
// Created: Sept 2017
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/clippings/emails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/emails.html",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-style",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",	
	"dojo/data/ItemFileWriteStore",	
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dojo/store/Memory",
	"prcommon2/clippings/add_server",
	"prcommon2/clippings/add_header",
	"prcommon2/clippings/add_footer",
	"prcommon2/clippings/add_layout"
	],
	function(declare, BaseWidgetAMD, template, utilities2, topic, request, lang, domstyle, domattr, domclass, ItemFileReadStore, ItemFileWriteStore, JsonRest, Observable, MemoryStore){

 return declare("prcommon2.clippings.emails",
	[BaseWidgetAMD],{
	templateString:template,
	constructor: function()
	{
	
		this._send_call_back = lang.hitch(this, this._send_call);
		this._customerid = PRMAX.utils.settings.cid;
		this._customeremailserver =  new ItemFileWriteStore({ url:"/common/lookups?searchtype=customeremailserver"});
		this._emailheader =  new ItemFileWriteStore({ url:"/common/lookups?searchtype=emailheader"});
		this._emailfooter =  new ItemFileWriteStore({ url:"/common/lookups?searchtype=emailfooter"});
		this._emaillayout =  new ItemFileWriteStore({ url:"/common/lookups?searchtype=emaillayout"});
		topic.subscribe('customeremailserver/add', lang.hitch(this, this._add_customeremailserver_event));
		topic.subscribe('/emailheader/add', lang.hitch(this, this._add_emailheader_event));
		topic.subscribe('/emailfooter/add', lang.hitch(this, this._add_emailfooter_event));
		topic.subscribe('/emaillayout/add', lang.hitch(this, this._add_emaillayout_event));
		this.userid = PRMAX.utils.settings.uid;		
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.customeremailserverid.set("store", this._customeremailserver);
		this.emailheaderid.set("store", this._emailheader);
		this.emailfooterid.set("store", this._emailfooter);
		this.emaillayoutid.set("store", this._emaillayout);
		
	},
	load:function(dialog)
	{
		this._dialog = dialog;	
	},
	_send:function()
	{
		if (utilities2.form_validator(this.form) == false)
		{
			alert("Please Enter Details");
			this.sendbtn.cancel();
			return false;
		}

		var content = this.form.get("value") ;
		content['userid'] = this.userid;
 		this.sendbtn.makeBusy();

		request.post('/clippings/emailsender/send_clippings_email',
			utilities2.make_params({ data : content})).
			then(this._send_call_back);

	},
	_send_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Clippings report has been sent");
			this._dialog.hide();
		}
		else
		{
			alert("Problem sending clippings report");
		}

		this.sendbtn.cancel();
	},
	_add_server:function()
	{
		this.add_server_dialog.show();
		this.add_server_ctrl.load(this.add_server_dialog, this._customerid);
	},
	_add_customeremailserver_event:function(data)
	{
	
		var customeremailserver = {};
		customeremailserver.id = data[0].customeremailserverid;
		customeremailserver.name = data[0].fromemailaddress;
		this._customeremailserver.newItem(customeremailserver);
		this.customeremailserverid.set("value", customeremailserver.id);

	},	
	_add_header:function()
	{
		this.add_header_dialog.show();
		this.add_header_ctrl.load(this.add_header_dialog, this._customerid);
	},
	_add_emailheader_event:function(data)
	{
		var emailheader = {};
		emailheader.id = data[0].emailheaderid;
		emailheader.name = data[0].emailheaderdescription;
		this._emailheader.newItem(emailheader);
		this.emailheaderid.set("value", emailheader.id);
	},	
	_add_footer:function()
	{
		this.add_footer_dialog.show();
		this.add_footer_ctrl.load(this.add_footer_dialog, this._customerid);
	},
	_add_emailfooter_event:function(data)
	{
		var emailfooter = {};
		emailfooter.id = data[0].emailfooterid;
		emailfooter.name = data[0].emailfooterdescription;
		this._emailfooter.newItem(emailfooter);
		this.emailfooterid.set("value", emailfooter.id);
	},	
//	_add_layout:function()
//	{
//		this.add_layout_dialog.show();
//		this.add_layout_ctrl.load(this.add_layout_dialog, this._customerid);
//	},
//	_add_emaillayout_event:function(data)
//	{
//		var emaillayout= {};
//		emaillayout.id = data[0].emaillayoutid;
//		emaillayout.name = data[0].emaillayoutdescription;
//		this._emaillayout.newItem(emaillayout);
//		this.emaillayoutid.set("value", emaillayout.id);
//	},	

});
});
