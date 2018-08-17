define([
	"dojo/_base/declare", // declare
	"prmaxtouch/customdialog",
	"ttl/BaseWidgetAMD",
	"dojo/text!../edit/templates/edit.html",
	"ttl/utilities2",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/number",
	"dojo/topic",
	"prmaxtouch/enquiries/headerbar",
	"prmaxtouch/keyboard",
	"prmaxtouch/datepad",
	"prmaxtouch/numberpad",
	"prmaxtouch/itemselector",
	"prmaxtouch/enquiries/edit/edit",
	"dijit/layout/BorderContainer",
	"dijit/layout/StackContainer"
	],
	function(declare, customdialog, BaseWidgetAMD, template, utilities2, request, lang, domclass, domattr, domstyle, NumberFormat, topic){
 return declare("edit.edit",
	[BaseWidgetAMD],{
	templateString:template,
	pprdialog:new customdialog(),
	constructor: function()
	{
		this.focuscontrol = null;	
		this.area = null;
		
		this._update_call_back = lang.hitch(this,this._update_call);
	
		topic.subscribe("confirm/prmaxtouch/enquiry/update/submit", lang.hitch(this, this.update_confirm));
		topic.subscribe("confirm/prmaxtouch/enquiry/update/finish", lang.hitch(this, this.finish_confirm));
		topic.subscribe("dialog/hold_focus", lang.hitch(this, this.hold_focus));
		topic.subscribe("input/push_close", lang.hitch(this, this.force_close));
		topic.subscribe("keyboard/push_string", lang.hitch(this, this.push_string));
		topic.subscribe("numberpad/push_string", lang.hitch(this, this.push_string));
		topic.subscribe("datepad/push_date", lang.hitch(this, this.push_date));
		topic.subscribe("selector/push_change", lang.hitch(this, this.push_change));
		
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.header_bar._fill(this.logout,"fa-pencil",this.iemployeeid,this.ioutletid,this.isubject,this.familyname,this.firstname);

		// client list
		this.clientitems = JSON.parse(decodeURIComponent(this.iclientitems));
		this.clientstore = this.create_store(this.clientitems);

		// take by user
		this.takenbyitems = JSON.parse(decodeURIComponent(this.itakenbyitems));
		this.takenbystore = this.create_store(this.takenbyitems);

		domattr.set(this.email,"innerHTML",this.iemail);
		domattr.set(this.phone,"innerHTML",this.iphone);
		domattr.set(this.facebook,"innerHTML",this.ifacebook);
		domattr.set(this.twitter,"innerHTML",this.itwitter);
		
		this.clientid.value = this.iclientid;
		if (this.iclientid != -1 && this.iclientid != "")
		{
			this.clientstring.value = this.clientstore[this.iclientid].name;
		}
		this.takenbyid.value = this.itakenby;
		if (this.itakenby != -1 && this.takenby != "")
		{
			this.takenbystring.value = this.takenbystore[this.itakenby].name;
		}

		this.crm_subject.value = this.isubject;
		this.crm_response.value = this.iresponse;
		
		this.taken.value = this.itaken;
		this.contacthistoryid.value = this.icontacthistoryid;
		this.outletid.value = this.ioutletid;
		this.employeeid.value = this.iemployeeid;
		this.contactid.value = this.icontactid;
		
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
	_back:function()
	{
		window.location = "/enquiries/search/search";
	},
	_submit:function()
	{
		this.pprdialog.confirm({
			topic: "confirm/prmaxtouch/enquiry/update/submit",
			title: "Update Enquiry",
			message: "<p>Are you sure you wish<br/>to update this enquiry?</p>"});
	},
	

	update_confirm:function(response)
	{
		if (response == "yes")
		{
			this.submitbtn.disabled = "disabled";
			domclass.add(this.finishbtn.domNode, "button-disabled");
			var date = new Date(Date.parse(this.taken.value));
			
			var content = {};
			content["taken"] = ttl.utilities2.to_json_date(date);
			content["userid"] = this.takenbyid.value;
			content["subject"] = this.crm_subject.value;
			content["crm_response"] = this.crm_response.value;
			content["details"] = this.crm_subject.value;
			content["clientid"] = this.clientid.value;
			content["employeeid"] = this.employeeid.value;
			content["outletid"] = this.outletid.value;
			content["contacthistoryid"] = this.contacthistoryid.value;
	
			request.post("/enquiries/update/submit",utilities2.make_params({data: content}))
				.then(this._update_call_back,this._error_handle_back);
		}
	},

	_update_call:function(response)
	{
		if (response.success == "OK")
		{
			this.contacthistoryid = response.contacthistoryid;
			this.pprdialog.info({
				topic: "confirm/prmaxtouch/enquiry/update/finish",
				title: "Update Enquiry",
				message: "<p>The enquiry has been updated.</p>"});
		}
		else
		{
			if (response.message && response.message[1])
				this.pprdialog.error({
					title: "Cannot Save Details",
					message: response.message[1]});
			else
				this.pprdialog.error({title: "Cannot Save Details"});
			this.submitbtn.disabled = false;
			domclass.remove(this.finishbtn.domNode, "button-disabled");
		}
	},
	finish_confirm:function(response)
	{
		window.location = "/enquiries/details/view/"+ this.icontacthistoryid;
	},	
/*
	_change_call:function(response)
	{
		if (response.success == "OK")
			window.location = "/contacts/details/edit/" + this.contactid;
		else
		{
			if (response.message && response.message[1])
				this.pprdialog.error({
					title: "Cannot Save Details",
					message: response.message[1]});
			else
				this.pprdialog.error({title: "Cannot Save Details"});
			this.submitbtn.disabled = false;
			domclass.remove(this.finishbtn.domNode, "button-disabled");
		}
	},
*/
	_menu_clear:function()
	{
	},
	_general_page:function()
	{
		this._menu_clear();
		domclass.add(this.generalbtn,"input-button-on");
		domclass.remove(this.detailgeneral,"pprhidden");
		domclass.remove(this.enquirybtn, "input-button-on");
		domclass.add(this.enquiry, "pprhidden");
	},
	_enquiry_page:function()
	{
		this._menu_clear();
		domclass.add(this.enquirybtn,"input-button-on");
		domclass.remove(this.enquiry,"pprhidden");
		domclass.remove(this.generalbtn, "input-button-on");
		domclass.add(this.detailgeneral, "pprhidden");
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
		if (this.area)
		{
			domstyle.set(this.area, "top", "0px");
		}
		if (this.focuscontrol)
			this.focuscontrol.blur();
		domclass.add(this.keyboard.domNode, "pprhidden");
		domclass.add(this.datepad.domNode, "pprhidden");
		domclass.add(this.itemselector.domNode, "pprhidden");
		this._validate();
	},
	input_focus:function(inputaround,inputtype,area,selectall)
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
			this.area = area;
			var diff = this.mainpanel.domNode.clientHeight / 1.86 - inputaround.getBoundingClientRect().top + domstyle.get(area, "top");
			if (diff > 0)
				diff = 0;
			domstyle.set(this.area, "top", diff.toString() + "px");
			domclass.remove(inputtype.domNode, "pprhidden");
			inputaround.focus();
		}
	},

/*
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

	credit_clear:function()
	{
		domclass.remove(this.holiday_credit_def,"input-button-on");
		domclass.remove(this.holiday_credit_no,"input-button-on");
		domclass.remove(this.holiday_credit_yes,"input-button-on");
	},

	credit_def:function()
	{
		this.holidaycredit = -1;
		this.credit_clear();
		domclass.add(this.holiday_credit_def,"input-button-on");
	},

	credit_no:function()
	{
		this.holidaycredit = 0;
		this.credit_clear();
		domclass.add(this.holiday_credit_no,"input-button-on");
	},

	credit_yes:function()
	{
		this.holidaycredit = 1;
		this.credit_clear();
		domclass.add(this.holiday_credit_yes,"input-button-on");
	},

	charge_clear:function()
	{
		domclass.remove(this.charge_swipe_no,"input-button-on");
		domclass.remove(this.charge_swipe_yes,"input-button-on");
	},

	charge_no:function()
	{
		this.chargeswipe = 0;
		this.charge_clear();
		domclass.add(this.charge_swipe_no,"input-button-on");
	},

	charge_yes:function()
	{
		this.chargeswipe = 1;
		this.charge_clear();
		domclass.add(this.charge_swipe_yes,"input-button-on");
	},
	
*/
	_main_back:function()
	{
		this.editpanel.selectChild(this.mainpanel);
	},

	page_first:function()
	{
		if (this.mempage > 1)
			this.goto_page(1);
	},

	page_previous:function()
	{
		if (this.mempage > 1)
			this.goto_page(this.mempage - 1);
	},

	page_next:function()
	{
		if (this.mempage < this.maxpage)
			this.goto_page(this.mempage + 1);
	},

	page_last:function()
	{
		if (this.mempage < this.maxpage)
			this.goto_page(this.maxpage);
	},

	goto_page:function(mempage)
	{
	},

	_insert:function()
	{
	},


	_delete:function()
	{
		this.pprdialog.confirm({
			topic: "confirm/embedded/customer/delete",
			title: "Delete Customer",
			message: "<p>Are you sure you wish to<br/>delete this customer?</p>"});
	},
	
	_delete_confirm:function(response)
	{
		if (response == "yes")
			this.pprdialog.confirm({
				topic: "confirm/embedded/customer/delete_final",
				title: "Delete Customer",
				important: true,
				message: "<p>Deleting this customer<br/>cannot be undone.<br/><br/>Are you absolutely sure?</p>"});
	},
	
	_delete_confirm_final:function(response)
	{
		if (response == "yes")
			request.post("/customer/edit/delete",utilities2.make_params({data: {icustomerid: this.customerid} }))
				.then(this._delete_call_back,this._error_handle_back);
	},
	
	_delete_call:function(response)
	{
		window.location = "/customer/search/criteria" + this.pq;
	},
	client_focus:function()
	{
		this.input_focus(this.clientstring,this.itemselector,this.enquiry);
		if (this.clientid.value == -1)
			itemindex = 0;
		else
			itemindex = this.clientstore[this.clientid.value].index;
		var prevcontrol = this.typestring;
		this.itemselector.push_focus(this.clientstring,this.crm_response,this.taken,this.clientid,this.clientitems,itemindex);
	},
	takenby_focus:function()
	{
		this.input_focus(this.takenbystring,this.itemselector,this.enquiry);
		if (this.takenbyid.value == -1)
			itemindex = 0;
		else
			itemindex = this.takenbystore[this.takenbyid.value].index;
		this.itemselector.push_focus(this.takenbystring,this.taken,this.crm_subject,this.takenbyid,this.takenbyitems,itemindex);
	},
	crm_response_focus:function()
	{
		this.input_focus(this.crm_response,this.keyboard,this.enquiry);
		this.keyboard.push_focus(this.crm_response,this.crm_subject,this.clientstring);
	},
	crm_subject_focus:function()
	{
		this.input_focus(this.crm_subject,this.keyboard,this.enquiry);
		this.keyboard.push_focus(this.crm_subject,this.takenbystring,this.crm_response);
	},
	taken_focus:function()
	{
		this.input_focus(this.taken,this.datepad,this.enquiry);
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
