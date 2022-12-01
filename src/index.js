
import { serial as serialPolyfill } from 'web-serial-polyfill';
import { WebUSBSerialDevice } from './ftdi';

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


let ftdiPort;
async function runFTDI() {
    const out = document.getElementById('outFTDI');
    
    try {
        out.innerHTML = '';
        const device = new WebUSBSerialDevice({
            overridePortSettings: true,
            // these are the defaults, this config is only used if above is true
            baud: 19200,
            bits: 8,
            stop: 1,
            parity: false
        });
        // shows browser request for usb device
        const port = ftdiPort = await device.requestNewPort();

        await port.connect(data => {
            out.innerHTML += 'Rec: ' + data.join(', ') + '\n';
        });

        let send = async () => {
            out.innerHTML += 'Send 1, 3, 0, 52, 0, 1, 197, 196\n'
            const data = new Uint8Array([1, 3, 0, 52, 0, 1, 197, 196 ]);
            await port.send(data);
            setTimeout(send, 5000);
        }
        send();
    }
    catch (e) {
      out.innerHTML = e.message;
    }
}

document.getElementById('requestUSB').addEventListener('click', runUSB);
document.getElementById('requestSerial').addEventListener('click', runSerial);
document.getElementById('requestFTDI').addEventListener('click', runFTDI);
