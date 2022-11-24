define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/topic",
	"dojo/text!../main/templates/deskframe.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojox/collections/Dictionary",
	"dijit/layout/ContentPane",
	"dijit/layout/StackContainer",
	"prmaxquestionnaires/main/deskbanner",
	"prmaxquestionnaires/pages/DeskDetails"
], function(declare, BaseWidgetAMD, topic, template, BorderContainer, lang, domclass, domattr, Dictionary){

 return declare("prmaxquestionnaires.main.deskframe",
	[BaseWidgetAMD, BorderContainer],{
	questionnaireid:-1,
	gutters:true,
	templateString: template,
	constructor: function()
	{
		topic.subscribe("/show_page", lang.hitch(this, this._show_page_call));
		this._current_page = "title";
		this._pages_control = new Dictionary();
		this._save_sequence= null;
		this.reset_controls_back = lang.hitch(this, this.reset_controls);
	},
	postCreate:function()
	{
		// setup page control
		this._pages_control.add("title", {next:"journalists", prev:null,save:true, ctrl: this.maindetails, saves:new Array()});
		this._pages_control.add("journalists", {next:"related_outlets", prev:"title",save:true, ctrl: this.journalists, saves:new Array()});
		this._pages_control.add("related_outlets", {next:null, prev:"journalists",save:true, ctrl: this.related_outlets, saves:new Array()});

		var page = this._pages_control.item("title");
		page.saves.push(this._pages_control.item("related_outlets"));

		page = this._pages_control.item("related_outlets");
		page.saves.push(this._pages_control.item("title"));

		page = this._pages_control.item("journalists");
		page.saves.push(this._pages_control.item("title"));
		page.saves.push(this._pages_control.item("related_outlets"));

		if ( PRMAX.questionnaire.outlet.outlet.countryid == 119)
		{
			domattr.set(this.support_email_address,"href","mailto:researchgroup@prmax.co.uk");
			domattr.set(this.support_email_address,"innerHTML","researchgroup@prmax.co.uk");
		}

		this.inherited(arguments);

	},
	_show_page_call:function ( pagename )
	{
		switch ( pagename)
		{
		case "title":
			this.zone_cont.selectChild( this.maindetails);
			this._current_page = "title";
			break;
		case "journalists":
			this.zone_cont.selectChild( this.journalists);
			this._current_page = "journalists";
			break;
		case "related_outlets":
			this.zone_cont.selectChild( this.related_outlets);
			this._current_page = "related_outlets";
			break;
		}
		this._enable_controls();

		topic.publish("/shop_page_tab",pagename);
	},
	_update_next:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if (page_details.save != null)
		{
			page_details.ctrl.save_move(
			lang.hitch(this, this.move_page_next, page_details),
			this.reset_controls_back);
		}
		else
		{
			this._show_page_call(page_details.next);
			throw "N";
		}
	},
	move_page_next:function( page_ctrl )
	{
		this._show_page_call(page_ctrl.next);
	},
	move_page_prev:function( page_ctrl )
	{
		this._show_page_call(page_ctrl.prev);
	},
	_update_prev:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if (page_details.save != null)
		{
			page_details.ctrl.save_move(
			lang.hitch(this, this.move_page_prev, page_details),
			this.reset_controls_back);
		}
		else
		{
			this._show_page_call(page_details.prev);
			throw "N";
		}
	},
	_save_completed:function()
	{
		var page_details = this._save_sequence.pop();
		if (page_details)
		{
			page_details.ctrl.save_move(
					lang.hitch(this, this._save_completed, page_details),this.reset_controls_back);
		}
		else
		{
			this.savebtn.cancel();
			alert("Saved");
		}
	},
	_update_save:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if (page_details.save != null)
		{
			this._save_sequence = new Array();
			for ( var key in page_details.saves)
				this._save_sequence.push(page_details.saves[key]);

			page_details.ctrl.save_move(
				lang.hitch(this, this._save_completed, page_details),this.reset_controls_back);
		}
	},
	_enable_controls:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if ( page_details.next == null )
			domclass.add(this.nextbtn.domNode,"prmaxhidden");
		else
			domclass.remove(this.nextbtn.domNode,"prmaxhidden");

		if ( page_details.prev == null )
			domclass.add(this.prevbtn.domNode,"prmaxhidden");
		else
			domclass.remove(this.prevbtn.domNode,"prmaxhidden");

		if ( page_details.save == null )
			domclass.add(this.savebtn.domNode,"prmaxhidden");
		else
			domclass.remove(this.savebtn.domNode,"prmaxhidden");


		this.reset_controls();

	},
	reset_controls:function()
	{
		this.nextbtn.cancel();
		this.prevbtn.cancel();
		this.savebtn.cancel();
	}
});
});
