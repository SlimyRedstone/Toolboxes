/* 
    ⎡                           ⎤
    ⎢ Functions for USB devices ⎥
    ⎣                           ⎦
*/

const USBClassCode = [
	{ type: 'device', name: 'undefined' },
	{ type: 'interface', name: 'audio' },
	{ type: 'both', name: 'cdc' },
	{ type: 'interface', name: 'hid' },
	{ type: 'interface', name: 'physical' },
	{ type: 'interface', name: 'image' },
	{ type: 'interface', name: 'printer' },
	{ type: 'interface', name: 'mass-storage' },
	{ type: 'interface', name: 'hub' },
	{ type: 'interface', name: 'cdc-data' },
	{ type: 'interface', name: 'smart-card' },
	{ type: 'interface', name: 'content-security' },
	{ type: 'interface', name: 'video' },
	{ type: 'interface', name: 'personal-healthcare' },
	{ type: 'interface', name: 'audio-video' },
	{ type: 'device', name: 'billboard' },
	{ type: 'interface', name: 'usb-c-bridge' },
	{ type: 'interface', name: 'usb-bulk-display' },
	{ type: 'interface', name: 'i3c' },
	{ type: 'both', name: 'diagnostic' },
	{ type: 'interface', name: 'wireless' },
	{ type: 'both', name: 'misc' },
	{ type: 'interface', name: 'app-specific' },
	{ type: 'both', name: 'vendor-specific' }
]

Number.prototype.USBgetClass = function() {
    const n = Math.min( Math.abs(this), USBClassCode.length-1 )
    return USBClassCode[ (typeof n == 'number') ? n : 0 ]
}

USBEndpoint.prototype.toJSONArray = function () {
	return {
		direction: this.direction,
		endpointNumber: this.endpointNumber,
		packetSize: this.packetSize,
		type: this.type
	}
}

USBAlternateInterface.prototype.toJSONArray = function () {
	var _endpoints = []
	this.endpoints.forEach((endpoint, index) => {
		_endpoints.push(endpoint.toJSONArray())
	})
	return {
		alternateSetting: this.alternateSetting,
		endpoints: _endpoints,
		interfaceClass: this.interfaceClass,
		interfaceName: this.interfaceName,
		interfaceProtocol: this.interfaceProtocol,
		interfaceSubclass: this.interfaceSubclass
	}
}

USBInterface.prototype.toJSONArray = function () {
	var alters = []
	this.alternates.forEach((alter, index) => {
		alters.push(alter.toJSONArray())
	})
	return {
		alternate: this.alternate.toJSONArray(),
		alternates: alters,
		claimed: this.claimed,
		interfaceNumber: this.interfaceNumber
	}
}

USBConfiguration.prototype.toJSONArray = function () {
	var _interfaces = []
	this.interfaces.forEach((interface, index) => {
		_interfaces.push(interface.toJSONArray())
	})
	return {
		configurationName: this.configurationName,
		configurationValue: this.configurationValue,
		interfaces: _interfaces
	}
}

USBDevice.prototype.toJSONArray = function () {
	var configs = []
	this.configurations.forEach((config, index) => {
		configs.push(config.toJSONArray())
	})
	return {
		_this: this,
		productName: this.productName,
		productId: this.productId,
		vendorId: this.vendorId,
		configuration: this.configuration.toJSONArray(),
		configurations: configs,
		manufacturerName: this.manufacturerName,
		opened: this.opened,
		serialNumber: this.serialNumber,
		usbVersionMajor: this.usbVersionMajor,
		usbVersionMinor: this.usbVersionMinor,
		usbVersionSubminor: this.usbVersionSubminor,
		deviceClass: this.deviceClass,
		deviceProtocol: this.deviceProtocol,
		deviceSubclass: this.deviceSubclass,
		deviceVersionMajor: this.deviceVersionMajor,
		deviceVersionMinor: this.deviceVersionMinor,
		deviceVersionSubminor: this.deviceVersionSubminor,
        custom: {
            Class: this.deviceClass.USBgetClass()
        }
	}
}

USBDevice.prototype.getHash = function (seed = Math.floor(Math.PI * 1e12)) {
	const productNameLength = this.productName.length
	const manufacturerNameLength = this.manufacturerName.length
	var hash = (((this.productId << 16) | this.vendorId) << 16) | (productNameLength * manufacturerNameLength)
	var hashStr = 0
	for (var index = 0; index < this.manufacturerName; index++) {
		const str_name = String(productNameLength > 1 ? this.productName : this.manufacturerName)
		hashStr += str_name.charCodeAt(index)
	}
	hash ^= seed
	hash = BigInt(BigInt(hash) % (BigInt(BigInt(1) << BigInt(32)) - BigInt(1)))
	return hash > 0 ? Number(hash) : Number(-hash)
	// return (hash % (2<<32)-1) ^ hashStr
}


/* 


*/
