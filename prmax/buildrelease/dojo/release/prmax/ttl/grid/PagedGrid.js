/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare","dgrid/Selection","dgrid/extensions/DijitRegistry","dgrid/Grid","dgrid/extensions/Pagination","dgrid/TouchScroll","dojo/dom-style"],function(_1,_2,_3,_4,_5,_6,_7){return _1("ttl.grid.PagedGrid",[_4,_5,_2,_3,_6],{postCreate:function(){this.inherited(arguments);_7.set(this.domNode,"height","100%");}});});