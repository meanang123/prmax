import unittest
from ttl.string import splitoutletname,SplitCharList


class TestStrings(unittest.TestCase):
    _BaseName ="This is a test name"
    _BaseSize = len(_BaseName.split())
    _charList="^"

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def test_outletname(self):
        ""
        name ="This is a test name"
      
        # standard space
        assert len(splitoutletname(name))==TestStrings._BaseSize
        # standard slit characters
        for c in SplitCharList :
            assert len(splitoutletname(name.replace(" ",c)))==TestStrings._BaseSize
        # non standard characters should fail 
        for c in TestStrings._charList:
            assert len(splitoutletname(name.replace(" ",c)))!=TestStrings._BaseSize
           

