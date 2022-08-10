/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


define(["dojo/_base/declare","dojo/dom-style","dgrid/List","dgrid/OnDemandGrid","dgrid/Selection","dgrid/editor","dgrid/Keyboard","dgrid/tree","dgrid/extensions/DijitRegistry","dgrid/TouchScroll"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){return _1("ttl.grid.Grid",[_3,_4,_5,_6,_7,_8,_9],{pagingDelay:100,postCreate:function(){this.inherited(arguments);_2.set(this.domNode,"height","100%");}});});