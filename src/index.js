async function run() {
    const out = document.getElementById('out');
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

document.getElementById('request').addEventListener('click', run);
