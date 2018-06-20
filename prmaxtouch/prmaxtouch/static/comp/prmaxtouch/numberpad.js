define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../prmaxtouch/templates/numberpad.html",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/topic",
	"dijit/TooltipDialog"
	],
	function(declare, BaseWidgetAMD, template, domclass, domattr, topic){
 return declare("prmaxtouch.numberpad",
	[BaseWidgetAMD],{
	templateString:template,
	inputstring:"",
	inputstart:0,
	inputend:0,
	decimal:0,
	focuscontrol:null,
	prevcontrol:null,
	nextcontrol:null,
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

	push_focus:function(focuscontrol,prevcontrol,nextcontrol,decimal,direction)
	{
		this.focuscontrol = focuscontrol;
		this.prevcontrol = prevcontrol;
		this.nextcontrol = nextcontrol;
		this.decimal = decimal;
		if (this.decimal > 0)
		{
			domclass.add(this.integer_row,"pprhidden");
			domclass.remove(this.decimal_row,"pprhidden");
		}
		else
		{
			domclass.remove(this.integer_row,"pprhidden");
			domclass.add(this.decimal_row,"pprhidden");
			if (this.decimal < 0)
			{
				domattr.set(this.positiveonly, "width", "33%");
				domattr.set(this.positiveonly, "colspan", "1");
				domclass.remove(this.negative, "pprhidden");
			}
			else
			{
				domattr.set(this.positiveonly, "width", "66%");
				domattr.set(this.positiveonly, "colspan", "2");
				domclass.add(this.negative, "pprhidden");
			}
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
	},

	push_string:function(pushstring)
	{
		this.inputstring = this.focuscontrol.value.replace("\u00A3","");
		this.inputstart = this.focuscontrol.selectionStart;
		this.inputend = this.focuscontrol.selectionEnd;

		var currentlength = this.inputstring.length - (this.inputend - this.inputstart);
		if (this.focuscontrol)
		{
			if (this.inputstart < this.inputend && (currentlength < this.focuscontrol.maxLength || this.focuscontrol.maxLength < 1))
			{
				this.inputstring = this.inputstring.substring(0,this.inputstart) + this.inputstring.substring(this.inputend);
			}
			if (pushstring == "del")
			{
				if (this.inputstart == this.inputend)
				{
					if (this.inputstart == 0)
						this.inputstring = this.inputstring.substring(1);
					else
					{
						this.inputstring = this.inputstring.substring(0,this.inputstart - 1) + this.inputstring.substring(this.inputstart);
						this.inputstart -= 1;
					}
				}
			}
			else if (currentlength < this.focuscontrol.maxLength || this.focuscontrol.maxLength < 1)
			{
				this.inputstring = this.inputstring.substring(0,this.inputstart) + pushstring + this.inputstring.substring(this.inputstart);
				this.inputstart += 1;
			}
			if (this.decimal !== "")
			{
				if (this.decimal == 0)
				{
					if (this.inputstring == "")
					{
						this.inputstring = "0";
						this.inputstart = 1;
					}
					if (this.inputstring == "-0" || this.inputstring == "0-")
						this.inputstring = "-";
					if (this.inputstring != "-")
						this.inputstring = parseInt(this.inputstring).toString();
				}
				else
				{
					checkstring = this.inputstring + "5";
					checkstring = parseFloat(checkstring).toString();
					if (checkstring.indexOf(".") > -1)
						checkstring = checkstring.substring(0, checkstring.indexOf(".") + 2 + this.decimal);
					this.inputstring = checkstring.substring(0, checkstring.length - 1);
				}
			}

			if ((isNaN(this.inputstring + "5") || this.inputstring == "") && this.decimal >= 0)
			{
				this.inputstring = "0";
				this.inputstart = 1;
			}

			if (this.inputstring == ".")
			{
				this.inputstring = "0.";
				this.inputstart = 2;
			}

			topic.publish("numberpad/push_string",this.focuscontrol,this.inputstring,this.inputstart,this.inputstart);
			this.focuscontrol.focus();
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

	press_1:function()
	{
		this.push_string("1");
	},

	press_2:function()
	{
		this.push_string("2");
	},

	press_3:function()
	{
		this.push_string("3");
	},

	press_4:function()
	{
		this.push_string("4");
	},

	press_5:function()
	{
		this.push_string("5");
	},

	press_6:function()
	{
		this.push_string("6");
	},

	press_7:function()
	{
		this.push_string("7");
	},

	press_8:function()
	{
		this.push_string("8");
	},

	press_9:function()
	{
		this.push_string("9");
	},

	press_dot:function()
	{
		if (this.inputstring.indexOf(".") == -1)
			this.push_string(".");
		else
			this.focuscontrol.focus();
	},

	press_0:function()
	{
		this.push_string("0");
	},

	press_minus:function()
	{
		if ((this.inputstring == "0" || this.inputstart == 0) && this.inputstring.indexOf("-") == -1)
			this.push_string("-");
	},

	press_del:function()
	{
		this.push_string("del");
	}

});
});
