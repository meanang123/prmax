/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.lists.projectfilter"]){dojo._hasResource["prmax.lists.projectfilter"]=true;dojo.provide("prmax.lists.projectfilter");dojo.require("dijit.form._FormWidget");dojo.declare("prmax.lists.projectfilter",dijit.form._FormWidget,{attributeMap:dojo.mixin(dojo.clone(dijit.form._FormWidget.prototype.attributeMap),{label:{node:"containerNode",type:"innerHTML"},iconClass:{node:"iconNode",type:"class"}}),templateString:"<div dojoType='dijit.form.FilteringSelect' dojoAttachPoint='containerNode' ></div>",resize:function(_1){}});}