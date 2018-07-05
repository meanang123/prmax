define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/selecttone.html",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/popup",
	"dijit/focus",
	"dijit/form/CheckBox",
	"dijit/TooltipDialog"
	], function(declare, BaseWidgetAMD, template,utilities2, topic, lang, domattr,domclass, popup, focus){
 return declare("prcommon2.clippings.selecttone",
	[BaseWidgetAMD],{
	templateString: template,
	name:"",
	value:"",
	constructor: function()
	{
		this.is_popup = false;
		this._close_popup_call = lang.hitch(this, this._close_popup);
	},
	postCreate:function()
	{
		popup.moveOffScreen(this.tone_view);
		this.inherited(arguments);
		domattr.set(this.selected_tones, "innerHTML", "ALL Tones");

		this._all_labels = [this.very_pos, this.pos, this.neutral, this.neg, this.very_neg];

	},
	_toggle:function(evt)
	{
		if ( this.is_popup == false )
		{
			popup.open({
				popup:this.tone_view,
				around:this.tones_node,
				x:evt.x,
				y:evt.y,
				onClose:this._close_popup_call,
				});
				this.is_popup = true;
			this.tone_view.focus();
		}
		else
		{
			this.is_popup = false;
			popup.close(this.tone_view);

		}
	},
	_close_tooltip:function()
	{
		this._getValueAttr();
		this.is_popup = false;
		popup.close(this.tone_view);
	},
	_close_popup:function()
	{
		this._getValueAttr();
		this.is_popup = false;
	},
	_getValueAttr:function()
	{
		this.tones = [];
		for ( var key in this._all_labels)
		{
			if (this._all_labels[key].get("checked"))
				this.tones.push(this._all_labels[key].get("tvalue"))
		}

		this._get_selected_tones_text();

		return this.tones;
	},
	_setValueAttr:function(value)
	{
		if ( value != null && value != "")
		{
			for ( var key in this._all_labels)
				this._all_labels[key].set("checked",false);

			for ( var key in value)
			{
				switch (value[key])
				{
					case 1:
					case "1":
						this.very_pos.set("checked",true);
						break;
					case 2:
					case "2":
						this.pos.set("checked",true);
						break;
					case 3:
					case "3":
						this.neutral.set("checked",true);
						break;
					case 4:
					case "4":
						this.neg.set("checked",true);
						break;
					case 5:
					case "5":
						this.very_neg.set("checked",true);
						break;
				}
			}

			this._getValueAttr();
		}
	},
	_get_selected_tones_text:function()
	{
		var selected_tones_text = '';

		for ( var key in this._all_labels)
		{
			if (this._all_labels[key].get("checked"))
				selected_tones_text += " " + this._all_labels[key].get("sname");
		}

		if (this.tones.length == 5){selected_tones_text = 'ALL Tones'};
		if (this.tones.length == 0){selected_tones_text = 'No Selection'};

		domattr.set(this.selected_tones,"innerHTML", selected_tones_text);
	},
	_change_tones:function(btn)
	{
		this._getValueAttr();
	},
	isValid:function()
	{
		this._getValueAttr();

		return this.tones.length == 0 ? false : true ;
	},
	_select_all:function()
	{
		for ( var key in this._all_labels)
			this._all_labels[key].set("checked",true);

		this._getValueAttr();
	},
	clear:function()
	{
		for ( var key in this._all_labels)
			this._all_labels[key].set("checked",true);

		this._getValueAttr();
	},
	_getDisplayedValueAttr:function()
	{
		return domattr.get(this.selected_tones,"innerHTML");
	},
	_close_pop_up:function()
	{
		this._close_tooltip();
	}
});
});
