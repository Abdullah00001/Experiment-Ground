import unittest
from utils.math import sum

def test_sum():
    assert sum(1,1)==2

class TestMathUtils(unittest.TestCase):
    """
    A Class To Test Utility Functions
    """ 
    def test_sum_function(self):
        """Test Sum Function"""
        self.assertEqual(sum(1,1),2)

if __name__ == "__main__":
    unittest.main()