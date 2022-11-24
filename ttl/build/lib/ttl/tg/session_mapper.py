from sqlalchemy.orm import mapper as sqla_mapper

def session_mapper(scoped_session):
    def mapper(cls, *arg, **kw):
        validate = kw.pop('validate', False)

        if cls.__init__ is object.__init__:
            def __init__(self, **kwargs):
                for key, value in kwargs.items():
                    if validate:
                        if not cls_mapper.has_property(key):
                            raise TypeError(
                                "Invalid __init__ argument: '%s'" % key)
                    setattr(self, key, value)
            cls.__init__ = __init__
        cls.query = scoped_session.query_property()
        cls_mapper = sqla_mapper(cls, *arg, **kw)
        return cls_mapper
    return mapper