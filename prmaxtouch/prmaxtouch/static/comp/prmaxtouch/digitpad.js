define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../prmaxtouch/templates/digitpad.html",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/Button"
	],
	function(declare, BaseWidgetAMD, template, domclass, topic, Button){
 return declare("prmaxtouch.digitpad",
	[BaseWidgetAMD],{
	templateString:template,
	amount:0,
	constructor: function()
	{
		this.input = "";
	},

	postCreate:function()
	{
		this.inherited(arguments);
	},

	update_display:function()
	{
		this.amount = Number(this.input);
		var temp = this.amount.toFixed(0);
		if (temp.length > 3)
			temp = temp.substring(0,temp.length - 3) + "," + temp.substring(temp.length - 3);
		if (temp.length > 6)
			temp = temp.substring(0,temp.length - 6) + "," + temp.substring(temp.length - 6);
		this.total_display.innerHTML = temp;
		topic.publish("digitpad/changed");
	},

	press_del:function()
	{
		if (this.input.length > 0)
			this.input = this.input.substring(0,this.input.length - 1);
		this.update_display();
	},

	press_1:function()
	{
		if (this.input.length < 5)
			this.input += "1";
		this.update_display();
	},

	press_2:function()
	{
		if (this.input.length < 5)
			this.input += "2";
		this.update_display();
	},

	press_3:function()
	{
		if (this.input.length < 5)
			this.input += "3";
		this.update_display();
	},

	press_4:function()
	{
		if (this.input.length < 5)
			this.input += "4";
		this.update_display();
	},

	press_5:function()
	{
		if (this.input.length < 5)
			this.input += "5";
		this.update_display();
	},

	press_6:function()
	{
		if (this.input.length < 5)
			this.input += "6";
		this.update_display();
	},

	press_7:function()
	{
		if (this.input.length < 5)
			this.input += "7";
		this.update_display();
	},

	press_8:function()
	{
		if (this.input.length < 5)
			this.input += "8";
		this.update_display();
	},

	press_9:function()
	{
		if (this.input.length < 5)
			this.input += "9";
		this.update_display();
	},

	press_0:function()
	{
		if (this.input.length < 5 && this.input.length > 0)
			this.input += "0";
		this.update_display();
	},

	press_submit:function()
	{
		topic.publish("pricepad/submit", this.amount);
	}

});
});
