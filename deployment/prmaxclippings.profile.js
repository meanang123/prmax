//To build just Dojo base, you just need an empty file.
dependencies ={
		action:"clean,release",
		optimize:"shrinksafe",
		cssOptimize:"comments",
		releaseName:"prmax",
		stripConsole: "all",
		mini:"true",
    layers:  [
		{
			name: "dojo.js",
			dependencies: [
				"dojo.loadInit",
				"dojo.text",
				"dojo.selector.acme",
				"dojo.selector.lite",
				"dojo.main",
				"dojo.cache",
				"dojo.parser",
				"dojo.fx.Toggler",
				"dojo.require",
				"dojo.dnd.Source",
				"dojo.dnd.Target",
				"dojo.dnd.AutoSource",
				"dojo.i18n",
				"dojo.fx",
				"dojo.NodeList-fx",
				"dijit._Widget",
				"dijit._Templated",
				"dojo.on",
				"dojo.has",
				"dojo.topic",
				"dojo.date",
				"dojo.date.locale",
				"dojo.regexp"
			]
		},
		{
			name: "../dojo/prmaxclippings.js",
			dependencies: [
			"dijit.dijit",
			"prcommon2.clippings.loaded"
			]
		}
	],
	//compress/build/
	prefixes: [
			[ "dijit", "../dijit" ],
			[ "dojox", "../dojox" ],
			[ 'dgrid', '../dgrid' ],
			[ "xstyle", "../xstyle"],
			[ "put-selector", "../put-selector"],
			[ "ttl", "c:\\projects\\prmax\\test\\ttl\\ttl\\static\\comp\\ttl" ],
			[ "prcommon2", "C:\\Projects\\prmax\\test\\prcommon\\prcommon\\static\\comp\\prcommon2" ]
    ]
};
