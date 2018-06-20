define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../prmaxtouch/templates/datepad.html",
	"dojo/dom-class",
	"dojo/topic"
	],
	function(declare, BaseWidgetAMD, template, domclass, topic){
 return declare("prmaxtouch.datepad",
	[BaseWidgetAMD],{
	templateString:template,
	monthset:new Date(),
	thedate:new Date(),
	istfn:false,
	ismoving:false,
	extend:0,
	focuscontrol:null,
	prevcontrol:null,
	nextcontrol:null,
	constructor: function()
	{
		this.months = ["January","February","March","April","May","June",
			"July","August","September","October","November","December"];
		this.days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	},

	postCreate:function()
	{
		this.inherited(arguments);

		if (this.extend)
		{
			domclass.add(this.standard, "pprhidden");
			domclass.remove(this.extended, "pprhidden");
		}
		this.monthset = new Date(this.monthset.getFullYear(), this.monthset.getMonth() + 1, 0);
	},

	hold_focus:function()
	{
		topic.publish("dialog/hold_focus");
	},

	push_focus:function(focuscontrol,prevcontrol,nextcontrol,cantfn,direction)
	{
		if (!this.ismoving)
		{
			this.focuscontrol = focuscontrol;
			this.prevcontrol = prevcontrol;
			this.nextcontrol = nextcontrol;
			if (this.focuscontrol.value == "TFN")
			{
				this.thedate = new Date(2100,0,1);
				this.istfn = true;
			}
			else if (this.focuscontrol.value)
			{
				this.thedate = new Date(Date.parse(this.focuscontrol.value));
				this.monthset = new Date(this.thedate.getFullYear(), this.thedate.getMonth() + 1, 0);
				this.istfn = false;
			}
			else
			{
				this.thedate = new Date();
				this.monthset = new Date(this.thedate.getFullYear(), this.thedate.getMonth() + 1, 0);
				this.istfn = false;
			}

			if (cantfn)
				domclass.remove(this.tfnbtn,"pprhidden");
			else
				domclass.add(this.tfnbtn,"pprhidden");

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
			this.format_days();
		}
		this.ismoving = false;
	},

	format_days:function()
	{
		this.month_year.innerHTML = this.months[this.monthset.getMonth()] + " " + this.monthset.getFullYear();
		this.month_year_extend.innerHTML = this.months[this.monthset.getMonth()] + " " + this.monthset.getFullYear();
		var monthdays = this.monthset.getDate();
		for (dayitem = 1; dayitem < 32; dayitem ++)
		{
			if (dayitem <= monthdays)
			{
				if (dayitem > 28)
					domclass.remove(this["btn" + dayitem],"pprhidden");
				var thisdate = new Date(this.monthset.getFullYear(),this.monthset.getMonth(),dayitem);
				if (thisdate.getTime() == this.thedate.getTime())
				{
					domclass.add(this["day_" + dayitem],"input-button-on");
				}
				else
					domclass.remove(this["day_" + dayitem],"input-button-on");
				this["btn" + dayitem].innerHTML = dayitem + "<br/><span>" + this.days[thisdate.getDay()] + "</span>";
			}
			else
				domclass.add(this["btn" + dayitem],"pprhidden");
		}
		if (this.istfn)
			domclass.add(this.day_tfn,"input-button-on");
		else
			domclass.remove(this.day_tfn,"input-button-on");
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

	year_minus_10:function()
	{
		if (this.monthset.getFullYear() > 1909)
			this.monthset = new Date(this.monthset.getFullYear() - 10, this.monthset.getMonth() + 1, 0);
		else
			this.monthset = new Date(1900, 1, 0);
		this.format_days();
		this.ismoving = true;
		this.focuscontrol.focus();
	},

	year_previous:function()
	{
		if (this.monthset.getFullYear() > 2000 || (this.extend && this.monthset.getFullYear() > 1900))
		{
			this.monthset = new Date(this.monthset.getFullYear() - 1, this.monthset.getMonth() + 1, 0);
			this.format_days();
		}
		this.ismoving = true;
		this.focuscontrol.focus();
	},

	month_previous:function()
	{
		if (this.monthset.getFullYear() > 2000 || (this.extend && this.monthset.getFullYear() > 1900) || this.monthset.getMonth() > 0)
		{
			this.monthset = new Date(this.monthset.getFullYear(), this.monthset.getMonth(), 0);
			this.format_days();
		}
		this.ismoving = true;
		this.focuscontrol.focus();
	},

	month_next:function()
	{
		if (this.monthset.getFullYear() < 2099 || this.monthset.getMonth() < 11)
		{
			this.monthset = new Date(this.monthset.getFullYear(), this.monthset.getMonth() + 2, 0);
			this.format_days();
		}
		this.ismoving = true;
		this.focuscontrol.focus();
	},

	year_plus_10:function()
	{
		if (this.monthset.getFullYear() < 2090)
			this.monthset = new Date(this.monthset.getFullYear() + 10, this.monthset.getMonth() + 1, 0);
		else
			this.monthset = new Date(2099, 12, 0);
		this.format_days();
		this.ismoving = true;
		this.focuscontrol.focus();
	},

	year_next:function()
	{
		if (this.monthset.getFullYear() < 2099)
		{
			this.monthset = new Date(this.monthset.getFullYear() + 1, this.monthset.getMonth() + 1, 0);
			this.format_days();
		}
		this.ismoving = true;
		this.focuscontrol.focus();
	},

	set_today:function()
	{
		this.istfn = false;
		this.thedate = new Date();
		this.thedate = new Date(this.thedate.getFullYear(), this.thedate.getMonth(), this.thedate.getDate());
		this.monthset = new Date(this.thedate.getFullYear(), this.thedate.getMonth() + 1, 0);
		this.format_days();
		var theday = this.thedate.getDate();
		var themonth = this.months[this.thedate.getMonth()];
		var theyear = this.thedate.getFullYear();
		var datestring = theday + " " + themonth + " " + theyear;
		topic.publish("datepad/push_date",this.focuscontrol,datestring);
		this.focuscontrol.focus();
	},

	push_day:function(pushday)
	{
		this.istfn = false;
		this.thedate = new Date(this.monthset.getFullYear(),this.monthset.getMonth(),pushday);
		this.format_days();
		var theday = this.thedate.getDate();
		var themonth = this.months[this.thedate.getMonth()];
		var theyear = this.thedate.getFullYear();
		var datestring = theday + " " + themonth + " " + theyear;
		topic.publish("datepad/push_date",this.focuscontrol,datestring);
		this.focuscontrol.focus();
	},

	press_1:function()
	{
		this.push_day(1);
	},

	press_2:function()
	{
		this.push_day(2);
	},

	press_3:function()
	{
		this.push_day(3);
	},

	press_4:function()
	{
		this.push_day(4);
	},

	press_5:function()
	{
		this.push_day(5);
	},

	press_6:function()
	{
		this.push_day(6);
	},

	press_7:function()
	{
		this.push_day(7);
	},

	press_8:function()
	{
		this.push_day(8);
	},

	press_9:function()
	{
		this.push_day(9);
	},

	press_10:function()
	{
		this.push_day(10);
	},

	press_11:function()
	{
		this.push_day(11);
	},

	press_12:function()
	{
		this.push_day(12);
	},

	press_13:function()
	{
		this.push_day(13);
	},

	press_14:function()
	{
		this.push_day(14);
	},

	press_15:function()
	{
		this.push_day(15);
	},

	press_16:function()
	{
		this.push_day(16);
	},

	press_17:function()
	{
		this.push_day(17);
	},

	press_18:function()
	{
		this.push_day(18);
	},

	press_19:function()
	{
		this.push_day(19);
	},

	press_20:function()
	{
		this.push_day(20);
	},

	press_21:function()
	{
		this.push_day(21);
	},

	press_22:function()
	{
		this.push_day(22);
	},

	press_23:function()
	{
		this.push_day(23);
	},

	press_24:function()
	{
		this.push_day(24);
	},

	press_25:function()
	{
		this.push_day(25);
	},

	press_26:function()
	{
		this.push_day(26);
	},

	press_27:function()
	{
		this.push_day(27);
	},

	press_28:function()
	{
		this.push_day(28);
	},

	press_29:function()
	{
		this.push_day(29);
	},

	press_30:function()
	{
		this.push_day(30);
	},

	press_31:function()
	{
		this.push_day(31);
	},

	press_tfn:function()
	{
		this.istfn = true;
		this.thedate.setFullYear(2100,0,1);
		this.format_days();
		topic.publish("datepad/push_date",this.focuscontrol,"TFN");
		this.focuscontrol.focus();
	}

});
});
