const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const text = document.getElementById("text");
function onResults(results) {
    videoElement.width = 0;
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    var count = 0;
    var count_ten = 0;
    if (results.multiHandLandmarks && results.multiHandedness) {
        
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
            const classification = results.multiHandedness[i];
            const isRightHand = classification.label === 'Left';
            const landmarks = results.multiHandLandmarks[i];
            

            var thumb = false;
            var index = false;
            var middle = false;
            var fore = false;
            var pinky = false;

            if (isRightHand) {
                if (landmarks[3].y > landmarks[4].y && landmarks[3].x <= landmarks[4].x) {
                    thumb = true;
                }
                if (landmarks[6].y > landmarks[8].y ) {
                    index = true;
                }
                if (landmarks[10].y > landmarks[12].y) {
                    middle = true;
                }
                if (landmarks[14].y > landmarks[16].y) {
                    fore = true;
                }
                if (landmarks[18].y > landmarks[20].y) {
                    pinky = true;
                }


                if (index == true && middle == false && fore == false && pinky == false) {
                    count = 1;
                    if (thumb == true) { count = count + 5; }
                    
                }

                if (index == true && middle == true && fore == false && pinky == false) {
                    count = 2;
                    if (thumb == true) { count = count + 5; }
                }

                if (index == true && middle == true && fore == true && pinky == false) {
                    count = 3;
                    if (thumb == true) { count = count + 5; }
                }

                if (index == true && middle == true && fore == true && pinky == true) {
                    count = 4;
                    if (thumb == true) { count = count + 5; }
                }
                if (thumb == true && index == false && middle == false && fore == false && pinky == false) {
                    count = 5;
                }
            }

            if (!isRightHand) {

                if (landmarks[3].y > landmarks[4].y && landmarks[3].x >= landmarks[4].x) {
                    thumb = true;
                }
                if (landmarks[6].y > landmarks[8].y) {
                    index = true;
                }
                if (landmarks[10].y > landmarks[12].y) {
                    middle = true;
                }
                if (landmarks[14].y > landmarks[16].y) {
                    fore = true;
                }
                if (landmarks[18].y > landmarks[20].y) {
                    pinky = true;
                }


                if (index == true && middle == false && fore == false && pinky == false) {
                    count_ten = 10;
                    if (thumb == true) { count_ten = count_ten + 50; }

                }

                if (index == true && middle == true && fore == false && pinky == false) {
                    count_ten = 20;
                    if (thumb == true) { count_ten = count_ten + 50; }
                }

                if (index == true && middle == true && fore == true && pinky == false) {
                    count_ten = 30;
                    if (thumb == true) { count_ten = count_ten + 50; }
                }

                if (index == true && middle == true && fore == true && pinky == true) {
                    count_ten = 40;
                    if (thumb == true) { count_ten = count_ten + 50; }
                }
                if (thumb == true && index == false && middle == false && fore == false && pinky == false) {
                    count_ten = 50;
                }
            }
            
            drawConnectors(
                canvasCtx, landmarks, HAND_CONNECTIONS,
                { color: isRightHand ? '#00FF00' : '#FF0000' }),
                drawLandmarks(canvasCtx, landmarks, {
                    color: isRightHand ? '#00FF00' : '#FF0000',
                    fillColor: isRightHand ? '#FF0000' : '#00FF00',
                    radius: (x) => {
                        return lerp(x.from.z, -0.15, .1, 10, 1);
                    }
                });
        }
    }
    console.log(count_ten + count);
    var c = count_ten + count;
    text.innerHTML = c.toString();
    canvasCtx.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});
hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();