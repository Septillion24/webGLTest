function showError(errorText) {
  const errorBoxDiv = document.getElementById("error-box");
  const errorTextElement = document.createElement("p");
  errorTextElement.innerText = errorText;
  errorBoxDiv.appendChild(errorTextElement);
  console.log(errorText);
}

function helloTriangle() {
  /** @type {HTMLCanvasElement|null}*/
  const canvas = document.getElementById("demo-canvas");

  if (!canvas) {
    showError("No demo reference");
    return;
  }
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    showError("No GL");
    return;
  }
  // big L if you have webgl 1

  const triangleVerticies = [
    // top
    0.0, 0.5,
    // bottom left
    -0.5, -0.5,
    //bottom right
    0.5, -0.5,
  ];
  const triangleVerticiesCpuBuffer = new Float32Array(triangleVerticies);

  const triangleGeoBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleVerticiesCpuBuffer, gl.STATIC_DRAW);

  const vertexShaderSourceCode = `#version 300 es
  precision mediump float;

  in vec2 vertexPosition;
  
  void main()
  {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }`;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    showError(`failed to compile vertex shader - ${compileError}`);
    return;
  }

  const fragmentShaderSourceCode = `#version 300 es
  precision mediump float;
  
  out vec4 outputColor;

  void main()
  {
    outputColor = vec4(0.8,0.8,0.0,1);
  }`;

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(fragmentShader);
    showError(`failed to compile frag shader  - ${compileError}`);
    return;
  }

  const triangleShaderProgram = gl.createProgram();
  gl.attachShader(triangleShaderProgram, vertexShader);
  gl.attachShader(triangleShaderProgram, fragmentShader);
  gl.linkProgram(triangleShaderProgram);
  if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
    const linkError = gl.getShaderInfoLog(triangleShaderProgram);
    showError(`failed to link shaders - ${linkError}`);
    return;
  }
  const vertexPositionAttributeLocaiton = gl.getAttribLocation(triangleShaderProgram, `vertexPosition`);
  if (vertexPositionAttributeLocaiton < 0) {
    showError(`didnt get correct attribute location for vertexPosition`);
    return;
  }
  // output merger
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.clearColor(0.08, 0.08, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Rasterization
  gl.viewport(0, 0, canvas.width, canvas.height);

  // GPU program
  gl.useProgram(triangleShaderProgram);
  gl.enableVertexAttribArray(vertexPositionAttributeLocaiton);

  //input assembler
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.vertexAttribPointer(
    vertexPositionAttributeLocaiton,
    2,
    gl.FLOAT,
    false,
    0,
    0
  )
  //draw call
  gl.drawArrays(gl.TRIANGLES, 0,3)


}

try {
  helloTriangle();
} catch (e) {
  showError(e);
}
