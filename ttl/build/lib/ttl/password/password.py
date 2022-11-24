import string, random


def extended_password(password_len=10):
	""" generate a password"""
	password = []
	for group in (string.ascii_letters, string.digits):
		password += random.sample(group, 3)

	password += random.sample(
		string.ascii_letters + string.digits,
		password_len - len(password))

	random.shuffle(password)
	password = ''.join(password)
	password = password.replace("<", "l")
	password = password.replace(">", "g")
	password = password.replace("&", "a")
	password = password.replace("'", "q")
	password = password.replace('"', "q")
	password = password.replace('I', "i")
	password = password.replace('l', "L")
	return password
