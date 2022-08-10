// wrapped by build app
define("ttl/FrameMngr", ["dijit","dojo","dojox","dojo/require!dijit/layout/StackContainer,dijit/layout/ContentPane"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    FrameMngr.js
// Author:  Chris Hoy
// Purpose: To control access to a stackcontainer used as the main page for the
//			application.
// Created: 04/02/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.FrameMngr");
dojo.provide("ttl.FramePage");
dojo.provide("ttl.FrameEvents");

dojo.require("dijit.layout.StackContainer");
dojo.require("dijit.layout.ContentPane");

dojo.declare(
	"ttl.FrameMngr",
	[dijit.layout.StackContainer],
	{
		load:function(key)
		{

		},
		// Thia add's a page to framemager
		// we can add text or create a an instance of a widget or a href to an actul
		// page
		addPage:function(args)
		{
			var page = null;
			var args2 = {preventCache:"True"};
			for (var a in args)
				args2[(a != 'id')?a:'key'] = args[a].toString();

			// created a widget
			if ( typeof(args2['widget']) != 'undefined')
			{
				_gArray.data1 = args2;
				eval("page = new "+args2['widget'].toString()+"(_gArray.data1,dojo.doc.createElement('div'));");
			}
			else
			{
				// create a standard page if this has a href then it will load the page
				args2['parent'] = dojo.doc.createElement('div')
				args2['parent'].style.cssText = "width:100%;height:100%";
				page = new ttl.FramePage(args2,args2['parent']);
			}
			// add the page
			this.addChild(page,0);
			// if the page was created and the arguments had a content field then this
			// is added to the page
			if ( typeof(args.content) != 'undefined' )
			{
				page.attr("content",ttl.utilities.unescapeHtml(args['content'].toString()));
			}

			if (page) this.showPage(page);
			return page||None;
		},
		// remove a page from the system
		deletePage:function(key)
		{

		},
		// get a specific page
		getPage:function(key)
		{
			this.key = key.toString();
			this.page = null;
			dojo.forEach(this.getChildren(), function(widget)
			{
				if (this.key === widget.key || this.key === widget.id)
				{
					this.page= widget;
				}
			},this);
			return this.page;
		},
		// show a page
		showPage:function(page)
		{
			this.selectChild(page);
		},
		resize:function()
		{
			this.inherited(arguments);
		}
	}
);

dojo.declare(
	"ttl.FrameEvents",
	null,
	{
		init: function()
		{
			this.framename = "std_view_stack";
		},
		clear: function()
		{

		},
		onShow:function()
		{
			this.resize();

		},
		resize:function()
		{
			var mainframe = dijit.byId("std_view_stack");
			if (mainframe)
			{
				var tmp  = dijit.byId(this.key);
				if ( tmp)
				{
					console.log("running resize key", this.key);
					tmp.resize(arguments[0]);
				}
			}
			this.inherited(arguments);
		}
	}
);

// standard page for the frame
dojo.declare(
	"ttl.FramePage",
	[ttl.layout.ContentPane,ttl.FrameEvents],
	{
		framename:"",
		onShow:function()
		{
		}
	}
);



});
