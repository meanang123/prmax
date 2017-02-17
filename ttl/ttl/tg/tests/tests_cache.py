import time
from datetime import timedelta
import tempfile
import os

import cache

def test_caches():
    # check the cache decorator basically works
    def key_fn():
        return 'test_caches_key'
    def version_fn():
        return 1
    
    def gen():
        yield 'one'
        yield 'two'
    
    gen=gen()
    
    @cache.cache_result(key_fn=key_fn,version_fn=version_fn)
    def willbecached():
        return gen.next()
    
    assert willbecached() == 'one'
    assert willbecached() == 'one'
    
    value,expires,version=cache._get(key_fn())
    assert value == 'one'
    assert version == 1

def test_cache_refreshes_from_version():
    version=1
    def key_fn():
        return 'test_cache_refreshes_from_version'
    def version_fn():
        return version
    
    def gen():
        yield 'one'
        yield 'two'
    
    gen=gen()
    
    @cache.cache_result(key_fn=key_fn,version_fn=version_fn)
    def willbecached():
        return gen.next()
    
    assert willbecached() == 'one'
    assert willbecached() == 'one'
    
    version=2
    assert willbecached() == 'two'
    assert willbecached() == 'two'

def test_cache_refreshes_from_timeout():
    def key_fn():
        return 'test_cache_refreshes_from_timeout'
    def version_fn():
        return 1

    def gen():
        yield 'one'
        yield 'two'

    gen=gen()

    @cache.cache_result(key_fn=key_fn,version_fn=version_fn,timeout_seconds=0.1)
    def willbecached():
        return gen.next()

    assert willbecached() == 'one'
    assert willbecached() == 'one'
    
    time.sleep(0.2)
    
    assert willbecached() == 'two'
    assert willbecached() == 'two'

def test_dummy_cache():
    '''dummy cache should not store values'''
    c=cache.DummyCache()
    c.set('key','value',30*60)
    assert c.get('key') == None
    c.delete('key')
    assert c.get('key') == None

def _text_cache_instance(c):
    c.set('key','value',30*60)
    assert c.get('key') == 'value'
    c.set('key2','value2',30*10)
    c.delete('key')
    assert c.get('key') == None
    assert c.get('key2') == 'value2'
    
    # test can store things that can be pickled (not just strings)
    c.set('key3',(1,0),30*20)
    assert c.get('key3') == (1,0)
    
    c.delete('key2')
    c.delete('key3')
    
    assert c.get('key2') == None
    assert c.get('key3') == None
    
    # now check expiration works
    c.set('expire me','expiring value',0.1)
    assert c.get('expire me') == 'expiring value'
    time.sleep(0.2)
    assert c.get('expire me') == None

def test_simple_cache():
    _text_cache_instance(cache.SimpleCache())

def test_localmem_cache():
    _text_cache_instance(cache.LocalMemCache())

def test_file_cache():
    tempd = tempfile.mkdtemp()
    _text_cache_instance(cache.FileCache(tempd))
    files=os.listdir(tempd)
    os.rmdir(tempd)