define([
	"dojo/_base/declare", // declare
	"prmaxtouch/customdialog",	
	"ttl/BaseWidgetAMD",
	"dojo/text!../add/templates/add.html",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ObjectStore",
	"dojo/store/Observable",	
	"dojo/data/ItemFileReadStore",	
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/topic",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",	
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/form/DateTextBox",
	"prmaxtouch/enquiries/add/headerbar",
	"prmaxtouch/numberpad",
	"prmaxtouch/keyboard",
	"prmaxtouch/itemselector",
	"dijit/form/FilteringSelect",
	"dijit/form/Select"
	],
	function(declare, customdialog, BaseWidgetAMD, template, utilities2, request, JsonRestStore, ObjectStore, Observable, ItemFileReadStore, lang, domclass, domattr, domstyle, topic){
 return declare("prmaxtouch.enquiries.add.add",
	[BaseWidgetAMD],{
	templateString:template,
	pprdialog:new customdialog(),	
	constructor: function()
	{
		this.focuscontrol = null;
		this.typestore = {};
		this.contacthistoryid = null;
		this.typeid = 5;

		this._clients = new Observable(new JsonRestStore({target:"/clients/rest_combo", idProperty:"id"}));
		this._users =  new ItemFileReadStore({url:"/user/user_list"}); 
		
		this._add_call_back = lang.hitch(this,this._add_call);

		topic.subscribe("confirm/prmaxtouch/enquiry/add/reset", lang.hitch(this, this.reset_confirm));
		topic.subscribe("confirm/prmaxtouch/enquiry/add/submit", lang.hitch(this, this.add_confirm));
		topic.subscribe("confirm/prmaxtouch/enquiry/add/finish", lang.hitch(this, this.finish_confirm));
		topic.subscribe("dialog/hold_focus", lang.hitch(this, this.hold_focus));
		topic.subscribe("input/push_close", lang.hitch(this, this.force_close));
		topic.subscribe("keyboard/push_string", lang.hitch(this, this.push_string));
		topic.subscribe("datepad/push_date", lang.hitch(this, this.push_date));
		topic.subscribe("selector/push_change", lang.hitch(this, this.push_change));
	},

	postCreate:function()
	{
		this.inherited(arguments);
		this.clientid.set("store", this._clients);
		this.clientid.set("value", -1);
		this.taken_by.set("store", this._users);
//		this.taken_by.set("value", 5732);
//		this.taken_by.value = PRMAX.utils.settings.username;
	},
	create_store:function(object)
	{

	},

	push_string:function(focuscontrol,inputstring,inputstart,inputend)
	{
		focuscontrol.value = inputstring;
		focuscontrol.selectionStart = inputstart;
		focuscontrol.selectionEnd = inputend;
		focuscontrol.focus();
		//this._validate();
	},

	push_date:function(focuscontrol,datestring)
	{
		focuscontrol.value = datestring;
		focuscontrol.focus();
		//this._validate();
	},

	push_change:function(focuscontrol,idstore,itemstring,itemvalue)
	{
		focuscontrol.value = itemstring;
		idstore.value = itemvalue;

		focuscontrol.focus();
		//this._validate();
	},

	type_clear:function()
	{
		domclass.remove(this.cus_type_5,"input-button-on");
		domclass.remove(this.cus_type_4,"input-button-on");
	},

	type_5:function()
	{
		this.typeid = 5;
		this.type_clear();
		domclass.add(this.cus_type_5,"input-button-on");
	},

	type_4:function()
	{
		this.typeid = 4;
		this.type_clear();
		domclass.add(this.cus_type_4,"input-button-on");
	},
	
	hold_focus:function()
	{
		setTimeout(lang.hitch(this, this.keep_focus), 5);
	},
	
	keep_focus:function()
	{
		this.focuscontrol.focus();
		clearTimeout(this.closetimer);
	},

	force_close:function()
	{
		setTimeout(lang.hitch(this, this.push_close), 10);
	},

	delay_close:function()
	{
		this.closetimer = setTimeout(lang.hitch(this, this.push_close), 10);
	},

	push_close:function()
	{
		domstyle.set(this.formpanel, "top", "0px");
		if (this.focuscontrol)
			this.focuscontrol.blur();
		domclass.add(this.keyboard.domNode, "pprhidden");
		domclass.add(this.datepad.domNode, "pprhidden");
		domclass.add(this.itemselector.domNode, "pprhidden");
		//this._validate();
	},

	input_focus:function(inputaround,inputtype,selectall)
	{
		if (this.kb || inputtype == this.datepad || inputtype == this.itemselector)
		{
			clearTimeout(this.closetimer);
			if (inputaround != this.focuscontrol)
			{
				if (selectall)
					inputaround.select();
				else
					inputaround.selectionStart = inputaround.value.length;
				this.push_close();
			}
			this.focuscontrol = inputaround;
			var diff = this.mainpanel.domNode.clientHeight / 1.86 - inputaround.getBoundingClientRect().top + domstyle.get(this.formpanel, "top");
			if (diff > 0)
				diff = 0;
			domstyle.set(this.formpanel, "top", diff.toString() + "px");
			domclass.remove(inputtype.domNode, "pprhidden");
			inputaround.focus();
		}
	},

	type_focus:function()
	{
		this.input_focus(this.typestring,this.itemselector);
		if (this.customertypeid.value == -1)
			itemindex = 0;
		else
			itemindex = this.typestore[this.customertypeid.value].index;
		this.itemselector.push_focus(this.typestring,this.email,this.startdate,this.customertypeid,this.typeitems,itemindex,2);
	},

	taken_focus:function()
	{		
		this.input_focus(this.taken,this.datepad);
		var nextcontrol = this.taken_by;
		var prevcontrol = this.clientid;
		var direction = 1;
		this.datepad.push_focus(this.taken,prevcontrol,nextcontrol,false,direction);	
	},
	taken_by_focus:function()
	{
//		this.input_focus(this.taken_by,this.keyboard);
//		this.keyboard.push_focus(this.taken_by,this.taken,this.crm_subject);
		this._validate();
	},
	crm_subject_focus:function()
	{
		this.input_focus(this.crm_subject,this.keyboard);
		this.keyboard.push_focus(this.crm_subject,this.taken_by,this.clientid);
	},

	clientid_focus:function()
	{
//		this.input_focus(this.clientid,this.keyboard);
//		this.keyboard.push_focus(this.clientid,this.crm_subject,this.taken);
	},
	crm_response_focus:function()
	{
		this.input_focus(this.crm_response,this.keyboard);
		this.keyboard.push_focus(this.crm_response,this.clientid,this.taken);
	},

	_reset:function()
	{
		this.pprdialog.confirm({
			topic: "confirm/prmaxtouch/enquiry/add/reset",
			title: "Clear Customer",
			message: "<p>Are you sure you wish to<br/>clear the enquiry details?</p>"});
	},
	
	reset_confirm:function(response)
	{
		if (response == "yes")
		{
			this.taken.value = "";
			this.taken_by.value = "";
			this.crm_subject.value = "";
			this.clientid.value = "";
			this.crm_response.value = "";
			this.itemselector.push_focus(this.typestring,this.taken_by,this.taken,this.clientid,this.typeitems,itemindex,2);
			//this._validate();
		}
	},
	_submit:function()
	{
		if (this.productid == 2)
			this.add_confirm("yes");
		else
			this.pprdialog.confirm({
				topic: "confirm/prmaxtouch/enquiry/add/submit",
				title: "Add Enquiry",
				message: "<p>Are you sure you wish<br/>to add this enquiry?</p>"});
	},
	
	add_confirm:function(response)
	{
		if (response == "yes")
		{
			this.submitbtn.disabled = "disabled";
			domclass.add(this.finishbtn.domNode, "button-disabled");
			
			var date = new Date(Date.parse(this.taken.value));
	
			var content = {};
			content["taken"] = ttl.utilities2.to_json_date(date);
			content["taken_by"] = this.taken_by.value;
			content["crm_subject"] = this.crm_subject.value;
			content["details"] = this.crm_subject.value;
			content["clientid"] = this.clientid.value;
			content["crm_response"] = this.crm_response.value;
			content["employeeid"] = "";
			content["outletid"] = "";
	
			request.post("/enquiries/add/submit",utilities2.make_params({data: content}))
				.then(this._add_call_back,this._error_handle_back);
		}
	},
	
	_add_call:function(response)
	{
		if (response.success == "OK")
		{
			this.contacthistoryid = response.contacthistoryid;
			this.pprdialog.info({
				topic: "confirm/prmaxtouch/enquiry/add/finish",
				title: "Add Enquiry",
				message: "<p>The enquiry has been added.</p>"});
		}
		else
		{
			this.pprdialog.error({
				title: "Add Enquiry",
				message: "<p>An unexpected error has occurred.</p>"});
			this.submitbtn.disabled = false;
			domclass.remove(this.finishbtn.domNode, "button-disabled");
		}
	},
	
	finish_confirm:function(response)
	{
		window.location = "/contact/search/search";
	},
	_validate:function()
	{
		var submitok = true;

		if (submitok)
		{
			this.submitbtn.disabled = false;
			domclass.remove(this.finishbtn.domNode, "button-disabled");
		}
		else
		{
			this.submitbtn.disabled = true;
			domclass.add(this.finishbtn.domNode, "button-disabled");
		}
	},
	
	_back:function()
	{
		window.location = "/contact/search/search";
	},
	
	
});
});
