define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../prmaxtouch/templates/itemselector.html",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/topic",
	"dijit/TooltipDialog"
	],
	function(declare, BaseWidgetAMD, template, domclass, domstyle, topic){
 return declare("prmaxtouch.itemselector",
	[BaseWidgetAMD],{
	templateString:template,
	viewindex:0,
	viewmax:0,
	inputitems:[],
	inputindex:0,
	inputvalue:-1,
	focuscontrol:null,
	prevcontrol:null,
	nextcontrol:null,
	idstore:null,
	currentcontrol:null,
	constructor: function()
	{
	},

	postCreate:function()
	{
		this.inherited(arguments);
	},

	hold_focus:function()
	{
		topic.publish("dialog/hold_focus");
	},

	push_focus:function(focuscontrol,prevcontrol,nextcontrol,idstore,inputitems,inputindex,direction)
	{
		this.focuscontrol = focuscontrol;
		this.prevcontrol = prevcontrol;
		this.nextcontrol = nextcontrol;
		this.idstore = idstore;
		this.inputvalue = idstore.value;
		this.inputitems = inputitems;
		this.inputindex = inputindex;

		if (this.focuscontrol != this.currentcontrol)
		{
			this.viewmax = this.inputitems.length - 6;
			if (inputindex < 4)
				this.viewindex = 0;
			else if (inputindex > this.viewmax + 2)
				this.viewindex = this.viewmax;
			else
				this.viewindex = inputindex - 2;
		}
		this.currentcontrol = this.focuscontrol;

		for (row = 1; row < 7 ; row ++)
		{
			if (row <= this.inputitems.length)
				domclass.remove(this["item_" + row],"pprhidden");
			else
				domclass.add(this["item_" + row],"pprhidden");
		}

		if (direction == 1 || direction == 3)
		{
			domclass.remove(this.nav_prev,"fa-arrow-circle-up");
			domclass.add(this.nav_prev,"fa-arrow-circle-left");
		}
		else
		{
			domclass.add(this.nav_prev,"fa-arrow-circle-up");
			domclass.remove(this.nav_prev,"fa-arrow-circle-left");
		}
		if (direction == 2 || direction == 3)
		{
			domclass.remove(this.nav_next,"fa-arrow-circle-down");
			domclass.add(this.nav_next,"fa-arrow-circle-right");
		}
		else
		{
			domclass.add(this.nav_next,"fa-arrow-circle-down");
			domclass.remove(this.nav_next,"fa-arrow-circle-right");
		}
		domclass.remove(this.listers,"pprhidden");
		this.set_position();
	},

	set_position:function()
	{
		if (this.viewmax <= 0)
		{
			domclass.add(this.scrollview, "pprhidden");
			domclass.add(this.scrollers, "pprhidden");
		}
		else
		{
			var scrollstart = 100 / (this.viewmax + 1) * this.viewindex;
			var scrollheight = 100 / (this.viewmax + 1);
			if (this.viewmax > 20)
			{
				var scrollstart = 95 / (this.viewmax + 1) * this.viewindex;
				var scrollheight = 95 / (this.viewmax + 1) + 5;
			}
			domstyle.set(this.scrollbar, "top", scrollstart + "%");
			domstyle.set(this.scrollbar, "height", scrollheight + "%");
			domclass.remove(this.scrollview, "pprhidden");
			domclass.remove(this.scrollers, "pprhidden");
		}

		for (row = 1; row < 7; row ++)
		{
			if (row <= this.inputitems.length)
			{
				this["item_" + row].innerHTML = this.inputitems[row + this.viewindex - 1].name;
				if (this.inputitems[row + this.viewindex - 1].id == this.inputvalue)
					domclass.add(this["item_row" + row],"input-button-on");
				else
					domclass.remove(this["item_row" + row],"input-button-on");
			}
		}
		if (this.viewindex > 0)
		{
			domclass.remove(this.btn_top_cell,"button-disabled");
			domclass.remove(this.btn_up_cell,"button-disabled");
		}
		else
		{
			domclass.add(this.btn_top_cell,"button-disabled");
			domclass.add(this.btn_up_cell,"button-disabled");
		}
		if (this.viewindex < this.viewmax)
		{
			domclass.remove(this.btn_down_cell,"button-disabled");
			domclass.remove(this.btn_bottom_cell,"button-disabled");
		}
		else
		{
			domclass.add(this.btn_down_cell,"button-disabled");
			domclass.add(this.btn_bottom_cell,"button-disabled");
		}
	},

	push_change:function(pushitem)
	{
		if (this.focuscontrol)
		{
			itemstring = this.inputitems[pushitem + this.viewindex - 1].name;
			itemvalue = this.inputitems[pushitem + this.viewindex - 1].id;
			for (row = 1; row < 7; row ++)
			{
				if (row <= this.inputitems.length)
				{
					this["item_" + row].innerHTML = this.inputitems[row + this.viewindex - 1].name;
					if (this.inputitems[row + this.viewindex - 1].id == this.inputvalue)
						domclass.add(this["item_row" + row],"input-button-on");
					else
						domclass.remove(this["item_row" + row],"input-button-on");
				}
			}
			topic.publish("selector/push_change",this.focuscontrol,this.idstore,itemstring,itemvalue);
		}
	},

	_close:function()
	{
		topic.publish("input/push_close");
	},

	move_up:function()
	{
		this.focuscontrol = this.prevcontrol;
		this.focuscontrol.focus();
		this.focuscontrol.click();
	},

	move_down:function()
	{
		this.focuscontrol = this.nextcontrol;
		this.focuscontrol.focus();
		this.focuscontrol.click();
	},

	press_item1:function()
	{
		this.push_change(1);
	},

	press_item2:function()
	{
		this.push_change(2);
	},

	press_item3:function()
	{
		this.push_change(3);
	},

	press_item4:function()
	{
		this.push_change(4);
	},

	press_item5:function()
	{
		this.push_change(5);
	},

	press_item6:function()
	{
		this.push_change(6);
	},

	item_top:function()
	{
		this.viewindex = 0;
		this.set_position();
		this.focuscontrol.focus();
	},

	item_up:function()
	{
		if (this.viewindex > 0)
			this.viewindex -= 1;
		this.set_position();
		this.focuscontrol.focus();
	},

	item_down:function()
	{
		if (this.viewindex < this.viewmax)
			this.viewindex += 1;
		this.set_position();
		this.focuscontrol.focus();
	},

	item_bottom:function()
	{
		this.viewindex = this.viewmax;
		this.set_position();
		this.focuscontrol.focus();
	}

});
});
