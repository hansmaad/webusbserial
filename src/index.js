
import { serial as serialPolyfill } from 'web-serial-polyfill';


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



let cleanupSerial = null;
async function runSerial() {
    if (cleanupSerial) {
        cleanupSerial();
        cleanupSerial = null;
    }
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

        const form = document.getElementById('serial-open');
        const openButton = document.getElementById('serialOpen');
        form.style.display = 'block';
        const openPort = async () => {
            try {
                const serialOptions = {
                    baudRate: +document.getElementById('baudRate').value,
                    dataBits: +document.getElementById('dataBits').value,
                    stopBits: +document.getElementById('stopBits').value,
                    parity: document.getElementById('parity').value,
                };
                console.log(serialOptions);
                await port.open(serialOptions);
                out.innerHTML += '\nopened';
            }
            catch (e) {
                out.innerHTML = e.message;
            }
        };
        openButton.addEventListener('click', openPort);
        cleanupSerial = () => {
            cleanupSerial && cleanupSerial();
            openButton.removeEventListener('click', openPort);
        };
    }
    catch (e) {
      out.innerHTML = e.message;
    }
}

document.getElementById('requestUSB').addEventListener('click', runUSB);
document.getElementById('requestSerial').addEventListener('click', runSerial);
