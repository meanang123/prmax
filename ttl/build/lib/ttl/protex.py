def simpleXor(in_string, key):
        key_list = []
        result = ""
        # Convert key into array of ASCII values
        for item  in key:
                key_list.append(ord(item))
        # Encode
        for i in range(len(in_string)):
                #Element from string
                item = ord(in_string[i])
                #Element from password, but because password is shorter use modulo
                key_item = ord(key[i%len(key)])
                #Actual XOR of both values
                xor = item ^ key_item
                result += chr(xor)
        return result

def simple_x_or(in_string, key):
        key_list = []
        result = ""
        # Convert key into array of ASCII values
        for item  in key:
                key_list.append(ord(item))
        # Encode
        for i in range(len(in_string)):
                #Element from string
                item = ord(in_string[i])
                #Element from password, but because password is shorter use modulo
                key_item = ord(key[i%len(key)])
                #Actual XOR of both values
                xor = item ^ key_item
                result += chr(xor)
        return result