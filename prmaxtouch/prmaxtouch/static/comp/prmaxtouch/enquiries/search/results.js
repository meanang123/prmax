define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/results.html",
	"dojo/dom-class",
	"ttl/utilities2",	
	"dojo/json",	
	"prmaxtouch/enquiries/search/headerbar",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane"
	],
	function(declare, BaseWidgetAMD, template, domclass, utilities2, json){
return declare("prmaxtouch.enquiries.search.results",
	[BaseWidgetAMD],{
	templateString:template,
	searchstring: "",
	constructor: function()
	{
		this.maxpage = 1;
	},

	postCreate:function()
	{
		this.inherited(arguments);

		this.header_bar._fill(this.logout,this.posid,this.customerid,this.returnurl,this.cusonly);

		this.maxpage = Math.ceil(this.total / 6);
		var start = new Date(Date.parse(this.from_date));
		var end = new Date(Date.parse(this.to_date));
		
		var daterange = {option:this.option, from_date:utilities2.to_json_date(start), to_date:utilities2.to_json_date(end)};		
		this.searchstring = "/enquiries/search/list?daterange=" + json.stringify(daterange);
		this.goto_page(this.listpage);
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
		if (this.familyname)
			liststring += "&familyname=" + this.familyname;
		if (this.firstname)
		{
			liststring += "&firstname=" + this.firstname;			
		}
		if (this.subject)
		{
			liststring += "&subject=" + this.subject;			
		}
		if (this.listpage)
			liststring += "&listpage=" + this.listpage;
		this.list_panel.set("href", liststring);
	},

	_back:function()
	{
		searchstring = "/enquiries/search/search";
		window.location = searchstring;
	},

	_add:function()
	{
		window.location = "/enquiries/new";
	}

});
});

