/* 
    ⎡                           ⎤
    ⎢     Random functions      ⎥
    ⎣                           ⎦
*/
function getRealType(v) {
	return Object.prototype.toString.call(v).slice(8,-1)
}
/* 
    ⎡                           ⎤
    ⎢   Functions for cookies   ⎥
    ⎣                           ⎦
*/

function setCookie(_name = '', _value = '', _expiration = 1) {
	const expDate = new Date()
	expDate.setTime(expDate.getTime() + _expiration * 24 * 3.6e3 * 1e3)
	document.cookie = `${_name}=${_value};expires=${expDate.toUTCString()};path=/`
}

function getCookie(_name = '') {
	var _return = { error: true, name: _name, value: '' }
	const decodedCookies = decodeURIComponent(document.cookie)
	if (!decodedCookies) return _return
	decodedCookies.split(';').forEach((cElement, iElement) => {
		// console.log(`[${iElement}] -> ${cElement}`)
		if (cElement.startsWith(`${_name}=`) || cElement.startsWith(` ${_name}=`)) {
			console.log(`Cookie "${_name}" do exist`)
			_return['error'] = false
			_return['value'] = cElement.split('=')[1].toString()
			return _return
		}
	})
	if (_return['error']) console.log(`Cookie "${_name}" don't exist`)
	return _return
}

function cookieExists(_name) {
	return !getCookie(_name)['error']
}

/* 
    ⎡                           ⎤
    ⎢   Functions for numbers   ⎥
    ⎣                           ⎦
*/
Number.prototype.isNegative = function () {
	return Boolean(this < 0)
}
Number.prototype.isPositive = function () {
	return Boolean(this >= 0)
}

Number.prototype.formatMetric = function (space=false,suffix='') {
	var exp = 0
	var n = this
	const prefixes = [
		['','m', 'µ', 'n', 'p', 'f', 'a'],
		['','k', 'M', 'G', 'T', 'P', 'E']
	]
	if (this > 0) {
		const factor = 1e3
		while (n >= 1e3) {
			n /= factor
			exp++
		}
	}
	if (this < 0) {
		const factor = 1e-3
		while (n >= factor) {
			n /= factor
			exp++
		}
	}
	return `${n.toFixed(2)}${space?' ':''}${prefixes[ this.isPositive()?1:0 ][exp]}${suffix.length?suffix:''}`.toString()	
}

Number.prototype.formatDataSize = function (binary_bytes = true) {
	var exp = 0
	var n = this
	const factor = binary_bytes ? 1024 : 1e3
	while (n >= factor) {
		n /= factor
		exp++
	}
	const sizes = [
		['iB', 'kiB', 'MiB', 'GiB', 'TiB'],
		['B', 'kB', 'MB', 'GB', 'TB']
	]
	return `${n.toFixed(2)} ${sizes[binary_bytes ? 0 : 1][exp]}`.toString()
}

Number.prototype.toHex = function () {
	var hex_text = this.toString(16).toUpperCase()
	while (hex_text.length % 2) {
		hex_text = `0${hex_text}`
	}
	return `0x${hex_text}`
}

Number.prototype.leftShift = function (shift_index = 0) {
	return Number(BigInt(this) << BigInt(shift_index))
}

/* 
    ⎡                           ⎤
    ⎢   Functions for strings   ⎥
    ⎣                           ⎦
*/
String.prototype.upperFirst = function () {
	return String(this.charAt(0).toUpperCase() + this.substr(1))
}

String.prototype.containedInArray = function (_arr = ['']) {
	var _return = false
	for (const v of _arr) {
		// console.log(`${v.length}: Testing if "${v}" is in "${this}" -> ` + (this.includes(v) ? '✔️' : '❌'))
		if (v.length)
			if (this.includes(v)) {
				_return = true
				break
			}
	}
	return _return
}
String.prototype.shorten = function (max_length = 32) {
	let str = this
	if (str.length > max_length)
		str = ''.concat(str.substring(0, max_length / 2), '...', str.substring(-(max_length / 2)))
	return str
}

String.prototype.hexToNumber = function () {
	const str = this.trim()
		.replaceAll(':', '')
		.replaceAll('/', '')
		.replaceAll('.', '')
		.replaceAll(',', '')
		.replaceAll(';', '')
	if (str.startsWith('0x')) return Number(str)
	else return Number(`0x${str}`.toString())
}

/* 
    ⎡                           ⎤
    ⎢    Functions for JSON     ⎥
    ⎣                           ⎦
*/

/* JSON.prototype.cleanJSON = function(obj){
    if (typeof obj !== 'object') throw TypeError
    return JSON.parse( JSON.stringify(obj) )
} */

/* 
    ⎡                           ⎤
    ⎢   Functions for arrays    ⎥
    ⎣                           ⎦
*/
Object.prototype.getKey = function (key, defaultValue=undefined) {
	return Object.keys(this).includes(key) ? this[key] : defaultValue
}
Array.prototype.hasKey = function (key) {
	return Boolean(Object.hasOwnProperty.call(this, key))
}

Array.prototype.last = function (negative_index = 0) {
	negative_index = Math.abs(negative_index)
	const last_index = this.length - 1
	return this[last_index - negative_index]
}
Array.prototype.lastIndex = function () {
	return this.length - 1
}

Array.prototype.getUniqueKeys = function (filter_key) {
	return [...new Set(this.map((key) => key[filter_key]))]
}

Array.prototype.append = function (value) {
	if (value instanceof Object) {
		if (value instanceof Array) {
			value.forEach((key, index) => {
				this.push(key)
			})
			return value
		}
	}
	this.push(value)
	return value
}
/* 
Array.prototype.prepend = function (pValue) {
	const old = this
	old.forEach((value, index) => {
		this[index + 1] = value
	})
	this[0] = pValue
} 
 */
/* Array.prototype.prepend = function (newValue) {
	const oldThis = this
	const _os = Math.max(newValue.length - 1, 1)
	const offset = newValue.length ? _os : 1
	
	if (newValue instanceof Object) {			// 	[] and {}
		if (newValue instanceof Array) {		// 	only []
			newValue.forEach((key, index) => {
				this[index] = key
				console.log(`Setting -> ${index}: ${key}`)
			})
		} else {
			this
		}
	}	else {								//	Neither

		// oldThis	-> [ 0, 1, 2, 3, 4, 5, 6 ]
		// this 	-> [ 0, 0, 1, 2, 3, 4, 5, 6 ]
		oldThis.forEach((key,index)=>{
			this[index+1] = key
		})
		this[0]=newValue
	}
	console.log(this)
	return newValue
} */

Array.prototype.remove = function (rValue) {
	var has_key = false
	var removed_index = -1
	const old = this
	old.forEach((value, index) => {
		if (removed_index >= 0) {
			this[index] = old[index + 1]
		} else {
			if (JSON.stringify(rValue) == JSON.stringify(value)) {
				removed_index = index
				this[index] = old[index + 1]
				has_key = true
			}
		}
	})

	delete this[old.length - 1]
	this.flat()
	// console.log(this.flat())
	return has_key
}
