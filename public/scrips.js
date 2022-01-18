// client-side JavaScript.
// canvas logic goes here (mouse event listeners) …

const SignatureCanvas = document.querySelector("#canvas");
const input = document.querySelector("input[name=signature]");

console.log(location.pathname);

if (location.pathname === "/thanks") {
    document.querySelector("a[href='/petition']").classList.add("on");
} else if (location.pathname.startsWith("/signers")) {
    document.querySelector("a[href='/signers']").classList.add("on");
} else {
    document
        .querySelector("a[href='" + location.pathname + "']")
        .classList.add("on");
}

// drawing a signature on the canvas

if (SignatureCanvas) {
    let line = SignatureCanvas.getContext("2d");
    line.strokeStyle = "#1c404c";
    let lineDraw = false;

    SignatureCanvas.addEventListener("mousedown", function (event) {
        line.beginPath();
        line.moveTo(event.layerX, event.layerY);
        lineDraw = true;
    });

    SignatureCanvas.addEventListener("mousemove", function (event) {
        if (lineDraw === true) {
            line.lineTo(event.layerX, event.layerY);
            line.stroke();
        }
    });

    SignatureCanvas.addEventListener("mouseup", function () {
        lineDraw = false;

        input.value = SignatureCanvas.toDataURL("image/png");
    });
}

let divH3 = document.querySelectorAll(".accordeon div");
for (let i = 0; i < divH3.length; i++) {
    divH3[i].addEventListener("click", function () {
        divH3[i].classList.toggle("on-acc");
    });
}

// old try for my hover-effect on the buttons;
// finally made with pseudo class :hover in css
/* let signButton = document.querySelectorAll("button");
signButton.addEventListener("mouseenter", function () {
    console.log("The mouse went over the sign button!");
    signButton.classList.toggle("on-sign-button");
}); */
