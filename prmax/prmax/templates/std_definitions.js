 djConfig={isDebug:${prmax['dojodebug']},
	popup:true,
	locale: 'en-gb',
	parseOnLoad:true,
	baseUrl:'/static/${prmax['dojopath']}/dojo/',
	modulePaths:
	{
		'ttl':'/ttl_comp/ttl',
		'prmax':'/static/dojo.comp/prmax',
		'prcommon':'/prcommon_comp/prcommon'
	}
};

// these are the global arrays
// this is for all the gobal obects
PRMAX = {};
PRCOMMON = {};
TTL = {};
// this is used by all the eval code that need to return response and  the variable names have been chnaged by
// the optimisze
_gArray = {};

//Global definitions
PRCOMMON.Events = null;
PRCOMMON.Constants = null;
PRMAX.DisplayObject = null;
TTL.UUID = null ;
PRMAX.utils = {};
PRCOMMON = {};
PRCOMMON.utils = {};

