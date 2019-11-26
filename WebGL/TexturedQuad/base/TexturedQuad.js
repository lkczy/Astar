// TexturedQuad.js
//顶点着色器程序
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +  
    'attribute vec2 a_TexCoord;\n'+
    'varying vec2 v_TexCoord;\n'+
    'void main(){\n' +
    'gl_Position=a_Position;\n' +
    'v_TexCoord = a_TexCoord;\n'+
    '}\n';

//片元着色器程序
    var FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform sampler2D u_Sampler;\n' +
    'varying vec2 v_TexCoord;\n' +
    'void main(){\n' +
    'gl_FragColor = texture2D(u_Sampler,v_TexCoord);\n' +
    '}\n';


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


    //设置顶点信息
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the position of the vertices');
        return;
    }

    // Set clear color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);

    //配置纹理（初始化纹理）
    if(!initTextures(gl,n)){
        console.log('Failed to set the position of the texture');
        return;
    }
}

function initVertexBuffers(gl) {
    var verticesTexCoords = new Float32Array([
        //顶点坐标，纹理坐标
        -0.5,  0.5,   0.0,2.0,
        -0.5, -0.5,   0.0,0.0,
         0.5,  0.5,   2.0,2.0,
         0.5, -0.5,   2.0,0.0
    ]);
    var n = 4;//顶点数目

    //创建缓冲区对象
    var verticesTexCoordBuffer = gl.createBuffer();
    if (!verticesTexCoordBuffer) {
        console.log('Failed to create the buffer object');
        return;
    }

    //将缓冲区对象绑定到目标
    gl.bindBuffer(gl.ARRAY_BUFFER, verticesTexCoordBuffer);
    //向缓冲区对象中写入数据
    gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);
    //获取attribute变量的储存位置

    var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    //将缓冲区对象分配给a_Position变量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE*4, 0);
    //连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position);

    //将纹理坐标分配给a_TexCoord开启它
    var a_TexCoord=gl.getAttribLocation(gl.program,'a_TexCoord');
    if(a_TexCoord<0){
        console.log('Failed to get the storage location of a_TexCoord');
        return;
    }
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,FSIZE*2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}

function initTextures(gl,n){
    var texture =gl.createTexture();//创建纹理对象
    if(!texture){
        console.log('Failed to create the texture object');
        return;
    }

    //获取u_Sampler
    var u_Sampler=gl.getUniformLocation(gl.program,'u_Sampler');
    if(!u_Sampler){
        console.log('Failed to get the storage location of u_Sampler');
        return false;
    }

    var image = new Image();//创建一个image对象
    if (!image) {
        console.log('Failed to create the image object');
        return false;
    }
    //注册图像加载事件的响应函数
    image.onload=function(){loadTexture(gl,n,texture,u_Sampler,image);};
    //浏览器开始加载图像
    image.src='../resources/sky.jpg';

    return true;
}

function loadTexture(gl,n,texture,u_Sampler,image){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);//对纹理图像进行y轴反转
    //开启0号纹理单元
    gl.activeTexture(gl.TEXTURE0);
    //向target绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);

    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    //将0号纹理传递给着色器
    gl.uniform1i(u_Sampler, 0);

    gl.clear(gl.COLOR_BUFFER_BIT);   //清除 <canvas>

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // 绘制出三角形
}


