import { WebUSBSerialDevice } from './ftdi';


let ftdiPort;
async function runFTDI() {
    const out = document.getElementById('outFTDI');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'HEX, eg. 01 03 00 FF';
    input.style.margin = '1em 0';
    input.value = '01 03 00 34 00 01 C5 C4';

    const sendButton = document.createElement('button');
    sendButton.type = 'button';
    sendButton.innerHTML = 'Send';

    out.parentElement.insertBefore(input, out);
    out.parentElement.insertBefore(sendButton, out);

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

        port.send(new Uint8Array([0]));
        sendButton.addEventListener('click', () => {
            const values = input.value.split(' ').map(n => parseInt(n, 16));
            out.innerHTML += `Send ${values.map(v => v.toString(16)).join(', ')}\n`
            const data = new Uint8Array(values);
            const _ = port.send(data);
        });
    }
    catch (e) {
      out.innerHTML = e.message;
    }
}


document.getElementById('requestFTDI').addEventListener('click', runFTDI);
