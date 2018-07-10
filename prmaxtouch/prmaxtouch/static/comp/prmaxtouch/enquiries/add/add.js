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
	"dijit/form/Select",
	"prmaxtouch/datepad"
	],
	function(declare, customdialog, BaseWidgetAMD, template, utilities2, request, JsonRestStore, ObjectStore, Observable, ItemFileReadStore, lang, domclass, domattr, domstyle, topic){
 return declare("prmaxtouch.enquiries.add.add",
	[BaseWidgetAMD],{
	templateString:template,
	pprdialog:new customdialog(),
	constructor: function()
	{
		this.focuscontrol = null;
		this.contacthistoryid = null;

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

		this.taken.value = this.datepad.get_today();

		// client list
		this.clientitems = JSON.parse(decodeURIComponent(this.clientitems));
		this.clientstore = this.create_store(this.clientitems);
		this.clientid.value = -1;
		this.clientstring.value = "Select a Client ...";

		// take by user
		this.takenbyitems = JSON.parse(decodeURIComponent(this.takenbyitems));
		this.takenbystore = this.create_store(this.takenbyitems);
		this.takenbyid.value = this.iuserid;
		this.takenbystring.value = this.user_name;

		// contact details
		this.outletid.value = this.ioutletid;
		this.iemployeeid.value = this.iemployeeid;

	},
	create_store:function(object)
	{
		var newstore = {};
		for (sitem = 0; sitem < object.length; sitem ++)
		{
			newstore[object[sitem].id] = {index: sitem, name: object[sitem].name};
			if (object[sitem].days)
				newstore[object[sitem].id].days = object[sitem].days
		}
		return newstore;
	},

	push_string:function(focuscontrol,inputstring,inputstart,inputend)
	{
		focuscontrol.value = inputstring;
		focuscontrol.selectionStart = inputstart;
		focuscontrol.selectionEnd = inputend;
		focuscontrol.focus();
		this._validate();
	},
	push_date:function(focuscontrol,datestring)
	{
		focuscontrol.value = datestring;
		focuscontrol.focus();
		this._validate();
	},
	push_change:function(focuscontrol,idstore,itemstring,itemvalue)
	{
		focuscontrol.value = itemstring;
		idstore.value = itemvalue;

		focuscontrol.focus();
		this._validate();
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
		this._validate();
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
			this.taken.value = this.datepad.get_today();
			this.clientid.value = -1;
			this.clientstring.value = "Select a Client ...";
			this.crm_subject.value = "";
			this.crm_response.value= "";
			this.takenbyid.value = this.iuserid;
			this.takenbystring.value = this.user_name;
			this._validate();

			setTimeout(lang.hitch(this, this._set_default_focus), 10);
		}
	},
	_set_default_focus:function()
	{
		this.taken_focus();
	},
	_submit:function()
	{
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
			content["taken_by"] = this.takenbyid.value;
			content["crm_subject"] = this.crm_subject.value;
			content["crm_response"] = this.crm_response.value;
			content["details"] = this.crm_subject.value;
			content["clientid"] = this.clientid.value;
			content["employeeid"] = this.employeeid.value;
			content["outletid"] = this.outletid.value;

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
	client_focus:function()
	{
		this.input_focus(this.clientstring,this.itemselector);
		if (this.clientid.value == -1)
			itemindex = 0;
		else
			itemindex = this.clientstore[this.clientid.value].index;
		var prevcontrol = this.typestring;
		this.itemselector.push_focus(this.clientstring,this.crm_response,this.taken,this.clientid,this.clientitems,itemindex);
	},
	takenby_focus:function()
	{
		this.input_focus(this.takenbystring,this.itemselector);
		if (this.takenbyid.value == -1)
			itemindex = 0;
		else
			itemindex = this.takenbystore[this.takenbyid.value].index;
		this.itemselector.push_focus(this.takenbystring,this.taken,this.crm_subject,this.takenbyid,this.takenbyitems,itemindex);
	},
	crm_response_focus:function()
	{
		this.input_focus(this.crm_response,this.keyboard);
		this.keyboard.push_focus(this.crm_response,this.crm_subject,this.clientstring);
	},
	crm_subject_focus:function()
	{
		this.input_focus(this.crm_subject,this.keyboard);
		this.keyboard.push_focus(this.crm_subject,this.takenbystring,this.crm_response);
	},
	taken_focus:function()
	{
		this.input_focus(this.taken,this.datepad);
		this.datepad.push_focus(this.taken,this.clientstring,this.takenbystring,false);
	},
	_validate:function()
	{
		var enabled = false;

		// must have a subject
		var tmp = this.crm_response.value.length;

		if (this.crm_subject.value.length)
		{
			enabled = true;
		}

		if (enabled == true)
		{
			this.submitbtn.disabled = false;
			domclass.remove(this.finishbtn.domNode, "button-disabled");
		}
		else
		{
			this.submitbtn.disabled = true;
			domclass.add(this.finishbtn.domNode, "button-disabled");

		}
	}
});
});
