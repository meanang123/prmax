import slimmer
import cherrypy
from turbogears import config

_decorator_enabled=config.get('compression.decorator.enabled',True)
_decorator_style=config.get('compression.decorator.style','xhtml').lower()
_decorator_style_valid  = ('html','xhtml')

if _decorator_style not in _decorator_style_valid:
	raise TypeError('default compression decorator style (%s) not valid '%_decorator_style)


import logging
log = logging.getLogger("ttl.compress")

def compress_result(style=None):
	'''
	'''
	_style = style if style else _decorator_style
	if _style not in _decorator_style_valid:
		raise TypeError('compression decorator style (%s) not valid '%_decorator_style)

	def decorator(fn):
		def decorated(*arg,**kw):
			data = fn(*arg,**kw)
			if not _decorator_enabled:
				return data
			else:
				try :
					return slimmer.slimmer(data,_style)
				except Exception , ex :
					log.exception("decorated")
					return data

		return decorated
	return decorator
