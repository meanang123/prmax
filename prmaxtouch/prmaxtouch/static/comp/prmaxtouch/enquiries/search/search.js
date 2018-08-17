define([
	"dojo/_base/declare", // declare
	"prmaxtouch/customdialog",
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/search.html",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/dom-style",
	"ttl/utilities2",	
	"dojo/topic",
	"dojo/json",
	"dijit/focus",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dijit/form/DateTextBox",	
	"prmaxtouch/contacts/search/headerbar",
	"prmaxtouch/numberpad",
	"prmaxtouch/keyboard",
	"prmaxtouch/itemselector",
	"prmaxtouch/datepad"	
	],
	function(declare, customdialog, BaseWidgetAMD, template, lang, domclass, domattr, domstyle, utilities2, topic, json, focusutil){
return declare("prmaxtouch.enquiries.search.search",
	[BaseWidgetAMD],{
	templateString:template,
	pprdialog:new customdialog(),	
	statusid:-1,
	comp_version:"criteria - 1.0.0.1",
	constructor: function()
	{
		this.ctrldown = false;
		this.closetimer = null;
		this.focuscontrol = null;
		this.locationstore = {};
		this.ownerstore = {};
		this.loaded = true;
		this._search_new = true;

		topic.subscribe("dialog/hold_focus", lang.hitch(this, this.hold_focus));
		topic.subscribe("input/push_close", lang.hitch(this, this.force_close));
		topic.subscribe("keyboard/push_string", lang.hitch(this, this.push_string));
		topic.subscribe("numberpad/push_string", lang.hitch(this, this.push_string));
		topic.subscribe("selector/push_change", lang.hitch(this, this.push_change));
		topic.subscribe("datepad/push_date", lang.hitch(this, this.push_date));
		topic.subscribe("selector/push_change", lang.hitch(this, this.push_change));
		
	},
	postCreate:function()
	{
		this.inherited(arguments);

		if (this.total == 0)
			domclass.remove(this.no_results, "pprhidden");

		if (this.istill)
		{
			this.loaded = false;
			focusutil.focus(this.accnbr);
		}
		this.container.resize();
		var years = 0;
		var months = 3;
		var days = 0;
		this.start_date.value = this.datepad.get_before_date(years,months,days);// 3 months ago
		this.end_date.value = this.datepad.get_today();
	},
	push_string:function(focuscontrol,inputstring,inputstart,inputend)
	{
		domclass.add(this.no_results, "pprhidden");
		focuscontrol.value = inputstring;
		focuscontrol.selectionStart = inputstart;
		focuscontrol.selectionEnd = inputend;
		focuscontrol.focus();
	},
	push_change:function(focuscontrol,idstore,itemstring,itemvalue)
	{
		domclass.add(this.no_results, "pprhidden");
		focuscontrol.value = itemstring;
		idstore.value = itemvalue;
		focuscontrol.focus();
	},
	push_date:function(focuscontrol,datestring)
	{
		focuscontrol.value = datestring;
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
		domstyle.set(this.existing_enquiry, "top", "0px");
		if (this.focuscontrol)
			this.focuscontrol.blur();
		domclass.add(this.keyboard.domNode, "pprhidden");
		domclass.add(this.numberpad.domNode, "pprhidden");
		domclass.add(this.itemselector.domNode, "pprhidden");
		domclass.add(this.datepad.domNode, "pprhidden");

	},
	input_focus:function(inputaround,inputtype,selectall)
	{
		if (this.kb || inputtype == this.datepad || inputtype == this.itemselector)
		{
			domclass.add(this.no_results, "pprhidden");
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
			if (this.loaded)
			{
				var diff = this.mainpanel.domNode.clientHeight / 1.86 - inputaround.getBoundingClientRect().top + domstyle.get(this.formpanel, "top");
				if (diff > 0)
					diff = 0;
				domstyle.set(this.formpanel, "top", diff.toString() + "px");
				domstyle.set(this.existing_enquiry, "top", diff.toString() + "px");
				this.loaded = true;
			}
			domclass.remove(inputtype.domNode, "pprhidden");
			inputaround.focus();
		}
	},
	keydown:function(event)
	{
		if (event.keyCode == 13)
			this._search();
	},
	new_familyname_focus:function()
	{
		this.input_focus(this.new_familyname,this.keyboard);
		this.keyboard.push_focus(this.new_familyname,this.new_outletname,this.new_firstname);
	},
	new_firstname_focus:function()
	{
		this.input_focus(this.new_firstname,this.keyboard);
		this.keyboard.push_focus(this.new_firstname,this.new_familyname,this.new_outletname);
	},
	new_outletname_focus:function()
	{
		this.input_focus(this.new_outletname,this.keyboard);
		this.keyboard.push_focus(this.new_outletname,this.new_firstname,this.new_familyname);
	},
 	existing_familyname_focus:function()
	{
		this.input_focus(this.existing_familyname,this.keyboard);
		this.keyboard.push_focus(this.existing_familyname,this.end_date,this.existing_firstname);
	},
	existing_firstname_focus:function()
	{
		this.input_focus(this.existing_firstname,this.keyboard);
		this.keyboard.push_focus(this.existing_firstname,this.existing_familyname,this.existing_subject);
	},
	existing_subject_focus:function()
	{
		this.input_focus(this.existing_subject,this.keyboard);
		this.keyboard.push_focus(this.existing_subject,this.existing_firstname,this.start_date);
	},
	
	startdate_focus:function()
	{
		this.input_focus(this.start_date,this.datepad);
		this.datepad.push_focus(this.start_date,this.existing_subject,this.end_date);
	},
	
	enddate_focus:function()
	{
		this.input_focus(this.end_date,this.datepad);
		this.datepad.push_focus(this.end_date,this.start_date,this.existing_familyname);
	},
	_add:function()
	{
		window.location = "/enquiries/new";
	},
	_reset:function()
	{
		this.new_familyname.value = "";
		this.new_firstname.value = "";
		this.new_outletname.value = "";
		this.existing_familyname.value = "";
		this.existing_firstname.value = "";
		this.existing_subject.value = "";
	},
	_search:function()
	{
		if (this._search_new == true)
		{
//			searchstring = "/contact/search/results?";
			searchstring = "/contact/search/results?";
			if (this.new_familyname.value > "")
				searchstring += "&familyname=" + encodeURIComponent(this.new_familyname.value);
			if (this.new_firstname.value > "")
				searchstring += "&firstname=" + encodeURIComponent(this.new_firstname.value);
			if (this.new_outletname.value > "")
				searchstring += "&outletname=" + encodeURIComponent(this.new_outletname.value);
			if (this.new_familyname.value == "" && this.new_firstname.value == "" && this.new_outletname.value == "")
			{
				this.pprdialog.error({
					title: "Search Contact",
					message: "<p>Please fill at least one of the fields <br/>Surname, Firstname or Outlet.</p>"});
			}
			else
			{
				window.location = searchstring;
			}
		}
		else
		{
			searchstring = "/enquiries/search/results?";
			var start = new Date(Date.parse(this.start_date.value));
			var end = new Date(Date.parse(this.end_date.value));
			var daterange = {option:"Between", from_date:utilities2.to_json_date(start), to_date:utilities2.to_json_date(end)};

			if (this.existing_familyname.value > "")
				searchstring += "&familyname=" + encodeURIComponent(this.existing_familyname.value);
			if (this.existing_firstname.value > "")
				searchstring += "&firstname=" + encodeURIComponent(this.existing_firstname.value);
			if (this.existing_subject.value > "")
				searchstring += "&subject=" + encodeURIComponent(this.existing_subject.value);
			searchstring += "&daterange=" + json.stringify(daterange);
			window.location = searchstring;
		}

	},

	nbr_ctrl_check:function(evt)
	{
		if (evt.keyCode == 17)
			this.ctrldown = true;
	},

	nbr_only:function(evt)
	{
		chr = evt.charCode;
		if (((chr > 0 && chr < 48) || chr > 57) && (this.ctrldown == false || chr == 118))
			evt.preventDefault();
	},
	
	page_first:function()
	{
		if (this.listpage > 1)
			this.goto_page(1);
	},

	page_previous:function()
	{
		if (this.listpage > 1)
			this.goto_page(this.listpage - 1);
	},

	page_next:function()
	{
		if (this.listpage < this.maxpage)
			this.goto_page(this.listpage + 1);
	},

	page_last:function()
	{
		if (this.listpage < this.maxpage)
			this.goto_page(this.maxpage);
	},

	goto_page:function(listpage)
	{
		this.listpage = listpage;
		var listtotal = this.listpage * 6;
		if (listtotal > this.total)
			listtotal = this.total;
		if (this.total == 0)
		{
			this.page_status.innerHTML = "0";
			this.page_total.innerHTML = "0";
		}
		else
		{
			this.page_status.innerHTML = this.listpage;
			this.page_total.innerHTML = this.maxpage;
		}
		
		if (this.listpage > 1)
		{
			domclass.remove(this.btn_first.domNode,"button-disabled");
			domclass.remove(this.btn_previous.domNode,"button-disabled");
		}
		else
		{
			domclass.add(this.btn_first.domNode,"button-disabled");
			domclass.add(this.btn_previous.domNode,"button-disabled");
		}
		if (this.listpage < this.maxpage)
		{
			domclass.remove(this.btn_next.domNode,"button-disabled");
			domclass.remove(this.btn_last.domNode,"button-disabled");
		}
		else
		{
			domclass.add(this.btn_next.domNode,"button-disabled");
			domclass.add(this.btn_last.domNode,"button-disabled");
		}

		if (this.maxpage > 1)
		{
			domclass.remove(this.list_container.domNode, "right-panel");
			domclass.remove(this.nav_control.domNode, "pprhidden");
		}
		else
		{
			domclass.add(this.list_container.domNode, "right-panel");
			domclass.add(this.nav_control.domNode, "pprhidden");
		}

		var liststring = this.searchstring.toString();
		if (this.searchurl)
			liststring += "&searchurl=" + this.searchurl;
		this.list_panel.set("href", liststring + "&listpage=" + this.listpage + "&criteriaurl=" + this.criteriaurl + this.pq);
	},
	_new_enquiry_page:function()
	{
		this._menu_clear();
		domclass.add(this.new_enquiry_btn,"input-button-on");
		domclass.remove(this.new_enquiry,"pprhidden");
		domclass.remove(this.existing_enquiry_btn, "input-button-on");
		domclass.add(this.existing_enquiry, "pprhidden");	
		this._search_new = true;
		this.existing_familyname.value = "";
		this.existing_firstname.value = "";
		this.existing_subject.value = "";
	},
	_existing_enquiry_page:function()
	{
		this._menu_clear();
		domclass.add(this.existing_enquiry_btn,"input-button-on");
		domclass.remove(this.existing_enquiry,"pprhidden");
		domclass.remove(this.new_enquiry_btn, "input-button-on");
		domclass.add(this.new_enquiry, "pprhidden");
		this._search_new = false;
		this.new_familyname.value = "";
		this.new_firstname.value = "";
		this.new_outletname.value = "";
	},
	_menu_clear:function()
	{
	},
	
});
});

