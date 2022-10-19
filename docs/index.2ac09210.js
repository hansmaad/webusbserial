document.getElementById("request").addEventListener("click",(async function(){const e=document.getElementById("out");try{const t=await navigator.usb.requestDevice({filters:[]});e.innerHTML=["productName","deviceClass","deviceSubclass","deviceProtocol"].map((e=>e+": "+t[e])).join("\n")}catch(t){e.innerHTML=t.message}}));
//# sourceMappingURL=index.2ac09210.js.map
