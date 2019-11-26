var VS_Source =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMat;\n' +
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +
    'void main()\n' +
    '{\n' +
    'gl_Position=u_ModelMat*a_Position;\n' +
    'v_Color=a_Color;\n' +
    '}\n';

var FS_Source =
    '#ifdef GL_ES\n' +
    'precision mediump float;\n' +
    '#endif\n' +
    'varying vec4 v_Color;\n' +
    'void main()\n' +
    '{\n' +
    '   gl_FragColor=v_Color;\n' +
    '}\n';


var RotateSelfSpeed = 45.0;
var RotateTargetSpeed = 30;
var lastFrameTime = Date.now();

function Main() {
    var canvas = document.getElementById("webgl");
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log("��ȡwebgl��ͼ������ʧ�ܣ�");
        return;
    }

    if (!initShaders(gl, VS_Source, FS_Source)) {
        console.log("��ʼ����ɫ��ʧ�ܣ�");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1);

    InitVertexBuffers(gl);

    //�����Ǿ���
    var modelMatBig = new Matrix4();
    //С���Ǿ���
    var modelMatSmall = new Matrix4();
    var currentTargetAngle = 0;
    var currentSelfAngle = 0;

    var tick = function () {
        var frameInterval = CalFrameInterval();
        currentTargetAngle = UpdateAngle(frameInterval, currentTargetAngle, RotateTargetSpeed);
        currentSelfAngle = UpdateAngle(frameInterval, currentSelfAngle, RotateSelfSpeed);

        //��������
        //Χ��һ������ת����  
        modelMatBig.setTranslate(0.0, 0.0, 0.0);
        modelMatBig.rotate(currentTargetAngle, 0, 0, 1);
        modelMatBig.translate(0.0, 0.0, 0.0);
        Draw(gl, 0, 3, modelMatBig, true);

        //��С����
        //Χ��һ������ת����
        modelMatSmall.setTranslate(0.0, 0.0, 0.0);
        modelMatSmall.rotate(currentTargetAngle, 0, 0, 1);
        modelMatSmall.translate(0.0, 0.0, 0.0);

        //��ת����
        modelMatSmall.translate(-0.5, -Math.sqrt(3) / 6, 0.0);
        modelMatSmall.rotate(currentSelfAngle, 0, 0, 1);
        modelMatSmall.translate(0.5, Math.sqrt(3) / 6, 0.0);

        Draw(gl, 3, 3, modelMatSmall, false);

        requestAnimationFrame(tick);
    };
    tick();
}

/**
 * �������㻺��
 * @param {*} gl 
 */
function InitVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, Math.sqrt(3) / 3, 1.0, 0.0, 0.0,
        -0.5, -Math.sqrt(3) / 6, 0.0, 1.0, 0.0,
        0.5, -Math.sqrt(3) / 6, 0.0, 0.0, 1.0,

        -0.5, -Math.sqrt(3) / 6 + 0.5 * Math.sqrt(3) / 3, 1.0, 0.0, 0.0,
        -0.5 - 0.5 * 0.5, -Math.sqrt(3) / 6 - 0.5 * Math.sqrt(3) / 6, 0.0, 1.0, 0.0,
        -0.5 + 0.5 * 0.5, -Math.sqrt(3) / 6 - 0.5 * Math.sqrt(3) / 6, 0.0, 0.0, 1.0,
    ]);
    var elementSize = vertices.BYTES_PER_ELEMENT;
    var vertiexBUffer = gl.createBuffer();
    if (!vertiexBUffer) {
        console.log("�������㻺��ʧ�ܣ�");
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertiexBUffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, elementSize * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, elementSize * 5, elementSize * 2);
    gl.enableVertexAttribArray(a_Color);
}

/**
 * ����ÿ֡���ʱ��
 */
function CalFrameInterval() {
    var thisFrameTime = Date.now();
    var frameInterval = thisFrameTime - lastFrameTime;
    lastFrameTime = thisFrameTime;
    return frameInterval;
}

/**
 * ������תֵ
 */
function UpdateAngle(frameInterval, currentAngle, rotateSpeed) {
    var targetAngle = currentAngle + rotateSpeed * frameInterval / 1000;
    targetAngle %= 360;
    return targetAngle;
}


/**
 * ����
 * @param {*} gl 
 * @param {*} count 
 * @param {*} modelMat 
 */
function Draw(gl, offest, count, modelMat, update) {
    var u_modelMat = gl.getUniformLocation(gl.program, "u_ModelMat");
    gl.uniformMatrix4fv(u_modelMat, false, modelMat.elements);

    if (update) {
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.drawArrays(gl.TRIANGLES, offest, count);
}
                    