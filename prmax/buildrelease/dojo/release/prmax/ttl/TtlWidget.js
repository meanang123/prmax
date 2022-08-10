/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["ttl.TtlWidget"]){dojo._hasResource["ttl.TtlWidget"]=true;dojo.provide("ttl.TtlWidget");dojo.declare("ttl.TtlWidget",null,{resize:function(_1){var c=this.getOuterSize(_1.parentNode);_1.style.height=c.h+"px";},getOuterSize:function(_2){var c=dojo.coords(_2);c.x=c.y=c.l=c.t=0;return c;}});}