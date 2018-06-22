define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../search/templates/results.html",
	"dojo/dom-class",
	"prmaxtouch/contacts/search/headerbar",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane"
	],
	function(declare, BaseWidgetAMD, template, domclass){
return declare("prmaxtouch.contacts.search.results",
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
		this.searchstring = "/customer/search/list?statusid=" + this.statusid;
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
		if (this.searchurl)
			liststring += "&searchurl=" + this.searchurl;
		this.list_panel.set("href", liststring + "&listpage=" + this.listpage + "&criteriaurl=" + this.criteriaurl + this.pq);
	},

	_back:function()
	{
		searchstring = "/customer/search/" + this.criteriaurl + "?statusid=" + this.statusid;
		if (this.accnumber > "")
			searchstring += "&accountnbr=" + encodeURIComponent(this.accnumber);
		if (this.subid > "")
			searchstring += "&subscriptionid=" + encodeURIComponent(this.subid);
		if (this.accname > "")
			searchstring += "&customername=" + encodeURIComponent(this.accname);
		if (this.accaddress > "")
			searchstring += "&address=" + encodeURIComponent(this.accaddress);
		if (this.cuslocationid > -1)
			searchstring += "&locationid=" + encodeURIComponent(this.cuslocationid);
		if (this.cusownerid > -1)
			searchstring += "&ownerid=" + encodeURIComponent(this.cusownerid);
		window.location = searchstring + this.pq;
	},

	_add:function()
	{
		window.location = "/customer/new" + this.pq;
	}

});
});

