// RotatedColoredTriangle_Matrix.js
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'uniform mat4 u_ModelMatrix;\n'+
    'attribute vec4 a_Color;\n' +
    'varying vec4 v_Color;\n' +//varying变量
    'void main(){\n' +
    'gl_Position = u_ModelMatrix * a_Position;\n' +
    'v_Color=a_Color;\n'+
    '}\n';

//片元着色器程序
var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n'+
    'void main(){\n' +
    'gl_FragColor = v_Color;\n' +
    '}\n';

//旋转速度（度/秒)
var ANGLE_STEP = 5.0;

function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');
    // 获取WebGL上下文
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //初始化着色器
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }

    //设置顶点位置
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    //设置<canvas>背景色
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    //获取u_ModelMatrix变量的储存位置
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (u_ModelMatrix < 0) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    //三角形的当前旋转角度
    var currentAngle = 0.0;
    //模型矩阵，Matrix4对象
    var modelMatrix = new Matrix4;

    //开始绘制三角形
    var tick = function () {
        currentAngle = animate(currentAngle);//更新旋转角
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);//清除上一个三角形，画出下一个三角形
        requestAnimationFrame(tick);//请求浏览器调用tick
    };
    tick();
}

function initVertexBuffers(gl) {
    var verticesColors = new Float32Array([
        //顶点坐标和点的颜色
        0.0,  Math.sqrt(3)/3, 1.0, 0.0, 0.0,
       -0.5, -Math.sqrt(3)/6, 0.0, 1.0, 0.0, 
        0.5, -Math.sqrt(3)/6, 0.0, 0.0, 1.0
    ]);
    var n = 3;//点的个数

    //创建缓冲区对象
    var vertexBuffer = gl.createBuffer();
    var vertexColorBuffer = gl.createBuffer();

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
                   
    //获取attribute变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*5, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    var a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    //设置旋转矩阵
    modelMatrix.setRotate(-currentAngle, 0, 0, 1);

    //将旋转矩阵传输给顶点着色器
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    //清除<canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    //绘制三角形
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

//记录上一次调用函数的时刻
var g_last = Date.now();
function animate(angle) {
    //计算距离上次调用经过了多少时间
    var now = Date.now();
    var elapsed = now - g_last;//毫秒
    g_last = now;
    //根据距离上次调用的时间，更新当前旋转角度
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;

}
