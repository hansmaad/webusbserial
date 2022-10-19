
import serialPolyfill from 'web-serial-polyfill';

async function runUSB() {
    const out = document.getElementById('outUSB');
    try {
      const device = await navigator.usb.requestDevice({ filters: [] });
      out.innerHTML = [
        'productName',
        'deviceClass',
        'deviceSubclass',
        'deviceProtocol',
      ].map(k => k + ': ' + device[k]).join('\n');
    }
    catch (e) {
      out.innerHTML = e.message;
    }
}

async function runSerial() {
    const out = document.getElementById('outSerial');
    try {
        out.innerHTML = '';
        let serial = serialPolyfill;
        if (navigator.serial) {
            serial = navigator.serial;
            out.innerHTML += '\nWeb Serial API supported. Polyfill not used.'
        }

        const port = await serial.requestPort();
        out.innerHTML = [
            'usbVendorId',
            'usbProductId',
          ].map(k => k + ': ' + port[k]).join('\n');
    }
    catch (e) {
      out.innerHTML = e.message;
    }
}

document.getElementById('requestUSB').addEventListener('click', runUSB);
document.getElementById('requestSerial').addEventListener('click', runSerial);
