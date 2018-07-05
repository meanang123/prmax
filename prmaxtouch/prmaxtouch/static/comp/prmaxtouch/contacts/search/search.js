define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/search.html",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/dom-style",
	"dojo/topic",
	"dijit/focus",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"prmaxtouch/contacts/search/headerbar",
	"prmaxtouch/numberpad",
	"prmaxtouch/keyboard",
	"prmaxtouch/itemselector"
	],
	function(declare, BaseWidgetAMD, template, lang, domclass, domattr, domstyle, topic, focusutil){
return declare("prmaxtouch.contacts.search.search",
	[BaseWidgetAMD],{
	templateString:template,
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

		topic.subscribe("dialog/hold_focus", lang.hitch(this, this.hold_focus));
		topic.subscribe("input/push_close", lang.hitch(this, this.force_close));
		topic.subscribe("keyboard/push_string", lang.hitch(this, this.push_string));
		topic.subscribe("numberpad/push_string", lang.hitch(this, this.push_string));
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
		domclass.add(this.numberpad.domNode, "pprhidden");
		domclass.add(this.itemselector.domNode, "pprhidden");
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

	accnbr_focus:function(evt)
	{
		try
		{
			if (evt.keyCode == 17)
				this.ctrldown = false;
		}
		catch(e){}

		this.input_focus(this.accnbr,this.numberpad);
		var prevcontrol = this.customeraddress;
		if (!domclass.contains(this.owner_row, "pprhidden"))
			prevcontrol = this.ownerstring;
		else if (!domclass.contains(this.location_row, "pprhidden"))
			prevcontrol = this.locationstring;
		var nextcontrol = this.customername;
		var direction = 0;
		if (this.sublabel)
		{
			nextcontrol = this.subscriptionid;
			direction = 2;
		}
		this.numberpad.push_focus(this.accnbr,prevcontrol,nextcontrol,-1,direction);
	},

	subid_focus:function(evt)
	{
		try
		{
			if (evt.keyCode == 17)
				this.ctrldown = false;
		}
		catch(e){}

		this.input_focus(this.subscriptionid,this.numberpad);
		this.numberpad.push_focus(this.subscriptionid,this.accnbr,this.customername,-1,1);
	},

	name_focus:function()
	{
		this.input_focus(this.customername,this.keyboard);
		var prevcontrol = this.accnbr;
		this.keyboard.push_focus(this.customername,prevcontrol,this.customeraddress);
	},
	familyname_focus:function()
	{
		this.input_focus(this.familyname,this.keyboard);
		this.keyboard.push_focus(this.familyname,this.firstname,this.firstname);
	},
	firstname_focus:function()
	{
		this.input_focus(this.firstname,this.keyboard);
		this.keyboard.push_focus(this.firstname,this.familyname,this.familyname);
	},

	address_focus:function()
	{
		this.input_focus(this.customeraddress,this.keyboard);
		var nextcontrol = this.accnbr;
		if (!domclass.contains(this.location_row, "pprhidden"))
			nextcontrol = this.locationstring;
		else if (!domclass.contains(this.owner_row, "pprhidden"))
			nextcontrol = this.ownerstring;
		this.keyboard.push_focus(this.customeraddress,this.customername,nextcontrol);
	},

	location_focus:function()
	{
		this.input_focus(this.locationstring,this.itemselector);
		if (this.shoplocationid.value == -1)
			itemindex = 0;
		else
			itemindex = this.locationstore[this.shoplocationid.value].index;
		var nextcontrol = this.accnbr;
		if (!domclass.contains(this.owner_row, "pprhidden"))
			nextcontrol = this.ownerstring;
		this.itemselector.push_focus(this.locationstring,this.customeraddress,nextcontrol,this.shoplocationid,this.locationitems,itemindex);
	},

	owner_focus:function()
	{
		this.input_focus(this.ownerstring,this.itemselector,this.detailgeneral);
		if (this.ownerid.value == -1)
			itemindex = 0;
		else
			itemindex = this.ownerstore[this.ownerid.value].index;
		var prevcontrol = this.customeraddress;
		if (!domclass.contains(this.location_row, "pprhidden"))
			prevcontrol = this.locationstring;
		this.itemselector.push_focus(this.ownerstring,prevcontrol,this.accnbr,this.ownerid,this.owneritems,itemindex);
	},

	_add:function()
	{
		window.location = "/enquiries/new";
	},

	_reset:function()
	{
		this.familyname.value = "";
		this.firstname.value = "";
	},

	_search:function()
	{
		searchstring = "/contact/search/results?";
		if (this.familyname.value > "")
			searchstring += "&familyname=" + encodeURIComponent(this.familyname.value);
		if (this.firstname.value > "")
			searchstring += "&firstname=" + encodeURIComponent(this.firstname.value);
		window.location = searchstring;
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
	
});
});

