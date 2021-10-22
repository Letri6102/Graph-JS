let diameter = 40;
let fontSize = 25;
let MSTEdgeWeight = 10;
let MSTEdgeColor = 'red';
let MSTVertexColor = 'blue';

let mouseIsDragged = false;
let currentVertex = null;
let PrimIsRunning = false;
let buttonSelectStartVertex;
let selectingStartVertex = false;
let selectedStartVertex = null;
let KruskalIsRunning = false;
let buttonStartKruskal;
let speedMS;
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

let buttonAddVertex;
let buttonAddEdge;
let buttonShowHideId;
let buttonResetGraph;
let buttonSelectVertexA;
let buttonSelectVertexB;
let selectedVertexA = null;
let selectedVertexB = null;
let selectingVertexA = false;
let selectingVertexB = false;
let weightInput;
let buttonSave;
let buttonImport;
let buttonImport1;
let buttonImport2;
let inputTextArea;
const graph = new Graph(diameter, fontSize);

function setup() {
	width = windowWidth - 30;
	height = windowHeight - 30;
	createCanvas(width, height);

	const posY = 4750;
	const lineHeight = 30;
	let line = 1;
	buttonAddVertex = createButton('Thêm Vertex');
	buttonAddVertex.position(15, posY + (lineHeight * line++));
	buttonAddVertex.mousePressed(addVertex);

	buttonShowHideId = createButton('Show Hide Id');
	buttonShowHideId.position(15, posY + (lineHeight * line++));
	buttonShowHideId.mousePressed(showHideId);

	buttonSelectVertexA = createButton('Chọn Vertex 1: ?');
	buttonSelectVertexA.id('buttonSelectVertexA');
	buttonSelectVertexA.position(15,posY + (lineHeight * line++));
	buttonSelectVertexA.mousePressed(selectVertexA);

	weightInput = createInput('100');
	weightInput.size(70);
	weightInput.position(15, posY + (lineHeight * line++));

	buttonSelectVertexB = createButton('Chọn Vertex 2: ?');
	buttonSelectVertexB.id('buttonSelectVertexB');
	buttonSelectVertexB.position(15, posY + (lineHeight * line++));
	buttonSelectVertexB.mousePressed(selectVertexB);

	buttonAddEdge = createButton('Thêm Edge');
	buttonAddEdge.position(15, posY + (lineHeight * line++));
	buttonAddEdge.mousePressed(addEdge);

	line++;
	let div = createDiv('');
	div.html('Tốc độ (ms) ', true);
	div.position(15, posY-5 + (lineHeight * line));
	speedMS = createInput('1000');
	speedMS.size(50);
	speedMS.position(105, posY + (lineHeight * line++));

	buttonSelectStartVertex = createButton(
		"Prim's Algorithm: chọn Start Vertex"
	);
	buttonSelectStartVertex.id('buttonSelectStartVertex');
	buttonSelectStartVertex.position(15, posY + (lineHeight * line++));
	buttonSelectStartVertex.mousePressed(selectStartVertex);

	buttonStartKruskal = createButton("Start Kruskal's Algorithm");
	buttonStartKruskal.id('buttonStartKruskal');
	buttonStartKruskal.position(15, posY + (lineHeight * line++));
	buttonStartKruskal.mousePressed(startKruskal);

	buttonResetGraph = createButton('Reset Graph');
	buttonResetGraph.position(15, posY + (lineHeight * line++));
	buttonResetGraph.mousePressed(resetGraph);

	line++;
	buttonSave = createButton('Save Image');
	buttonSave.position(15, posY + (lineHeight * line));
	buttonSave.mousePressed(saveImage);

	buttonImport = createButton('Import Graph');
	buttonImport.position(110, posY + (lineHeight * line++));
	buttonImport.mousePressed(importGraph);

	buttonImport = createButton('Import Graph 1');
	buttonImport.position(110, posY + (lineHeight * line++));
	buttonImport.mousePressed(importGraph1);

	buttonImport = createButton('Import Graph 2');
	buttonImport.position(110, posY + (lineHeight * line++));
	buttonImport.mousePressed(importGraph2);

	inputTextArea = createElement('TextArea');
	inputTextArea.id('inputTextArea');
	inputTextArea.position(15, posY + (lineHeight * line++));
	inputTextArea.size(200, 200);
	document.getElementById('inputTextArea').innerText = '';
}

function draw() {
	background(255);
	graph.draw();
	noLoop();
}

function addVertex() {
	graph.addVertex();
	loop();
}

function addEdge() {
	if (
		selectedVertexA &&
		selectedVertexB &&
		selectedVertexA.id !== selectedVertexB.id &&
		+weightInput.value() >= 0
	) {
		graph.connect(
			selectedVertexA.id,
			selectedVertexB.id,
			+weightInput.value(),
			'white',
			'blue',
			'white',
			'blue',
			'black',
			1
		);
		selectingVertexA = false;
		selectingVertexB = false;
		document.getElementById('buttonSelectVertexA').style.background =
			'white';
		document.getElementById('buttonSelectVertexB').style.background =
			'white';
		document.getElementById('buttonSelectVertexA').innerText =
			'Click Vertex 1';
		document.getElementById('buttonSelectVertexB').innerText =
			'Click Vertex2';
		loop();
	}
}

function selectStartVertex() {
	selectingStartVertex = true;
	KruskalIsRunning = false;
	selectingVertexA = false;
	selectingVertexB = false;
	document.getElementById('buttonSelectStartVertex').style.background =
		'yellow';
	document.getElementById('buttonSelectVertexA').innerText =
		'Chọn Vertex 1: ?';
	document.getElementById('buttonSelectVertexB').innerText =
		'Chọn Vertex 2: ?';
	document.getElementById('buttonSelectVertexA').style.background = 'white';
	document.getElementById('buttonSelectVertexB').style.background = 'white';
}

// ----------------------------------------------------
//----------------------ALGORITHM---------------------
// ----------------------------------------------------

//---------------PRIM----------------
async function PrimMST() {
	if (!selectedStartVertex) return; //Chọn đỉnh bắt đầu

	resetGraph(); //Reset màu
	loop();

	let MSTEdges = []; 
	let neighborhood = [];
	for (let edge of selectedStartVertex.edges) {
		neighborhood.push(edge); //push các cạnh kề 
		graph.connect(
			edge.vertexA.id,
			edge.vertexB.id,
			edge.weight,
			'white',
			'magenta',
			'white',
			'magenta',
			'magenta',
			MSTEdgeWeight / 2
		);
	}
	//sort tìm cạnh có trọng số nhỏ nhất
	neighborhood.sort(function (a, b) {
		return +b.weight - +a.weight;
	});
	let t = 0;
	while (
		MSTEdges.length < graph.vertices.length &&
		neighborhood.length > 0 &&
		t++ < 100 
	) {
		let newEdge = neighborhood.pop(); //lấy ra cạnh có trọng số nhỏ nhất
		MSTEdges.push(newEdge);

		graph.connect(
			newEdge.vertexA.id,
			newEdge.vertexB.id,
			newEdge.weight,
			'white',
			MSTVertexColor,
			'white',
			MSTVertexColor,
			MSTEdgeColor,
			MSTEdgeWeight
		);
		//Xét 2 đỉnh và set đã visited(true)
		newEdge.vertexA.mst = true;
		newEdge.vertexB.mst = true;
		loop();
		await delay(speedMS.value());
		for (let edge of newEdge.vertexB.edges) {
			if (!edge.vertexB.mst) {
				//Xét đỉnh tiếp theo (chưa được duyệt qua và hiển thị các cạnh liên kết)
				graph.connect(
					edge.vertexA.id,
					edge.vertexB.id,
					edge.weight,
					edge.vertexA.color,
					edge.vertexA.background,
					'white',
					'magenta',
					'magenta',
					MSTEdgeWeight / 2
				);
				neighborhood.push(edge);
			}
		}
		neighborhood.sort(function (a, b) {
			return +b.weight - +a.weight;
		});
		//Lọc ra những cạnh đã có đỉnh được xét duyệt qua 
		neighborhood = neighborhood.filter((edge) => {
			if (edge.vertexA.mst && edge.vertexB.mst) {
				graph.connect(
					edge.vertexA.id,
					edge.vertexB.id,
					edge.weight,
					edge.vertexA.color,
					edge.vertexA.background,
					edge.vertexB.color,
					edge.vertexB.background,
					'gray',
					0.4
				);
			}
			return !edge.vertexA.mst || !edge.vertexB.mst;
		});
		//Xét cạnh nhỏ nhất để vẽ màu xanh in cây khung
		if (neighborhood.length > 0) {
			const edge = neighborhood[neighborhood.length - 1];
			graph.connect(
				edge.vertexA.id,
				edge.vertexB.id,
				edge.weight,
				edge.vertexA.color,
				edge.vertexA.background,
				edge.vertexB.color,
				edge.vertexB.background,
				'green',
				MSTEdgeWeight
			);
			loop();
			await delay(speedMS.value());
		}
	}
	loop();

	//Console kết quả
	let mst = [];
	let totalWeight = 0;
	console.log("Prim's Algorithm: MSTEdges", MSTEdges);
	for (let edge of MSTEdges) {
		totalWeight += edge.weight;
		console.log(
			edge.vertexA.name + ' to ' + edge.vertexB.name + ': ' + edge.weight
		);
	}
	console.log("Prim's Algorithm: Total weight = " + totalWeight);
	PrimIsRunning = false;
	selectingStartVertex = false;
	document.getElementById('buttonSelectStartVertex').innerText =
		"Prim's Algorithm: chọn Start Vertex";
	document.getElementById('buttonSelectStartVertex').style.background =
		'white';
}

//------------------------------KRUSKAL----------------------
function startKruskal() {
	if (PrimIsRunning) return;
	KruskalIsRunning = true;
	PrimIsRunning = false;
	selectingVertexA = false;
	selectingVertexB = false;
	document.getElementById('buttonStartKruskal').style.background = 'yellow';
	document.getElementById('buttonSelectVertexA').innerText =
		'Chọn Vertex 1: ?';
	document.getElementById('buttonSelectVertexB').innerText =
		'Chọn Vertex 2: ?';
	document.getElementById('buttonSelectVertexA').style.background = 'white';
	document.getElementById('buttonSelectVertexB').style.background = 'white';

	KruskalMST();
}

async function KruskalMST() {
	if (graph.length === 0) return;

	resetGraph();
	loop();

	let edges = [];
	for (let vertex of graph.vertices) {
		for (let edge of vertex.edges) {
			if (
				edges.filter(
					(e) =>
						e.vertexA.id === edge.vertexB.id &&
						e.vertexB.id === edge.vertexA.id
				).length === 0
			) {
				edges.push(edge);
			}
		}
	}
	edges.sort(function (a, b) {
		return +b.weight - +a.weight;
	});
	// console.log(edges);
	// console.log(edges.pop());

	let MSTEdges = [];
	while (edges.length > 0) {
		const edge = edges.pop();
		// console.log(edge);
		const edgeIsGood = await thereIsNoLoop(edge, MSTEdges);
		if (edgeIsGood) {
			edge.vertexA.mst = true;
			edge.vertexB.mst = true;
			MSTEdges.push(edge);
			graph.connect(
				edge.vertexA.id,
				edge.vertexB.id,
				edge.weight,
				'white',
				MSTVertexColor,
				'white',
				MSTVertexColor,
				MSTEdgeColor,
				MSTEdgeWeight
			);
			loop();
			await delay(speedMS.value());
		}
	}
	let totalWeight = 0;
	console.log("Kruskal's Algorithm: MSTEdges", MSTEdges);
	for (let edge of MSTEdges) {
		totalWeight += edge.weight;
		console.log(
			edge.vertexA.name + ' to ' + edge.vertexB.name + ': ' + edge.weight
		);
	}
	console.log("Kruskal's Algorithm: Total weight = " + totalWeight);
	KruskalIsRunning = false;
	document.getElementById('buttonStartKruskal').style.background = 'white';
}

async function thereIsNoLoop(edge, MSTEdges) {
	if (!edge.vertexA.mst || !edge.vertexB.mst) {
		if (edge.vertexA.mst) {
			edge.vertexB.groupId = edge.vertexA.groupId;
		} else if (edge.vertexB.mst) {
			edge.vertexA.groupId = edge.vertexB.groupId;
		} else {
			edge.vertexA.groupId = Vertex.nextGroupId;
			edge.vertexB.groupId = Vertex.nextGroupId;
			Vertex.nextGroupId++;
		}
		return true;
	}
	if (edge.vertexA.groupId === edge.vertexB.groupId) {
		return false;
	}

	const groupBId = edge.vertexB.groupId;
	graph.connect(
		edge.vertexA.id,
		edge.vertexB.id,
		edge.weight,
		'white',
		MSTVertexColor,
		'white',
		MSTVertexColor,
		'green',
		MSTEdgeWeight
	);
	loop();
	await delay(speedMS.value() * 5);

	MSTEdges.forEach((e) => {
		if (e.vertexA.groupId === groupBId) {
			e.vertexA.groupId = edge.vertexA.groupId;
		}
		if (e.vertexB.groupId === groupBId) {
			e.vertexB.groupId = edge.vertexA.groupId;
		}
	});

	return true;
}

function selectVertexA() {
	selectingVertexA = true;
	document.getElementById('buttonSelectVertexA').style.background = 'yellow';
	document.getElementById('buttonSelectVertexA').innerText =
		'Click 1 vertex để chọn';
	selectingVertexB = false;
	document.getElementById('buttonSelectVertexB').style.background = 'white';
}

function selectVertexB() {
	selectingVertexA = false;
	document.getElementById('buttonSelectVertexA').style.background = 'white';
	selectingVertexB = true;
	document.getElementById('buttonSelectVertexB').style.background = 'yellow';
	document.getElementById('buttonSelectVertexB').innerText =
		'Click 1 vertex để chọn';
}

function showHideId() {
	Vertex.showHideId();
	loop();
}

function resetGraph() {
	graph.reset();
}

function importGraph1() {
	document.getElementById('inputTextArea').innerText =
		'[{"id":0,"name":"A","x":221,"y":761,"edges":[{"vertexBId":1,"weight":3},{"vertexBId":5,"weight":9},{"vertexBId":3,"weight":6}]},{"id":1,"name":"B","x":399,"y":651,"edges":[{"vertexBId":0,"weight":3},{"vertexBId":2,"weight":2},{"vertexBId":4,"weight":9},{"vertexBId":5,"weight":9},{"vertexBId":3,"weight":4}]},{"id":2,"name":"C","x":488,"y":465,"edges":[{"vertexBId":1,"weight":2},{"vertexBId":3,"weight":2},{"vertexBId":6,"weight":9},{"vertexBId":4,"weight":8}]},{"id":3,"name":"D","x":416,"y":304,"edges":[{"vertexBId":0,"weight":6},{"vertexBId":1,"weight":4},{"vertexBId":2,"weight":2},{"vertexBId":6,"weight":9}]},{"id":4,"name":"E","x":885,"y":620,"edges":[{"vertexBId":1,"weight":9},{"vertexBId":2,"weight":8},{"vertexBId":5,"weight":8},{"vertexBId":6,"weight":7},{"vertexBId":8,"weight":9},{"vertexBId":9,"weight":10}]},{"id":5,"name":"F","x":768,"y":1005,"edges":[{"vertexBId":0,"weight":9},{"vertexBId":1,"weight":9},{"vertexBId":4,"weight":8},{"vertexBId":9,"weight":18}]},{"id":6,"name":"G","x":881,"y":166,"edges":[{"vertexBId":2,"weight":9},{"vertexBId":3,"weight":9},{"vertexBId":4,"weight":7},{"vertexBId":7,"weight":4},{"vertexBId":8,"weight":5}]},{"id":7,"name":"H","x":1142,"y":108,"edges":[{"vertexBId":6,"weight":4},{"vertexBId":8,"weight":1},{"vertexBId":9,"weight":4}]},{"id":8,"name":"I","x":1263,"y":234,"edges":[{"vertexBId":4,"weight":9},{"vertexBId":6,"weight":5},{"vertexBId":7,"weight":1},{"vertexBId":9,"weight":3}]},{"id":9,"name":"J","x":1520,"y":243,"edges":[{"vertexBId":4,"weight":10},{"vertexBId":5,"weight":18},{"vertexBId":7,"weight":4},{"vertexBId":8,"weight":3}]}]';
	importGraph();
}

function importGraph2() {
	document.getElementById('inputTextArea').innerText =
		'[{"id":0,"name":"A","x":284,"y":758,"edges":[{"vertexBId":1,"weight":3},{"vertexBId":5,"weight":9},{"vertexBId":3,"weight":6}]},{"id":1,"name":"B","x":467,"y":685,"edges":[{"vertexBId":0,"weight":3},{"vertexBId":2,"weight":2},{"vertexBId":4,"weight":9},{"vertexBId":5,"weight":9},{"vertexBId":3,"weight":4}]},{"id":2,"name":"C","x":562,"y":444,"edges":[{"vertexBId":1,"weight":2},{"vertexBId":3,"weight":2},{"vertexBId":6,"weight":9},{"vertexBId":4,"weight":8},{"vertexBId":11,"weight":14}]},{"id":3,"name":"D","x":395,"y":258,"edges":[{"vertexBId":0,"weight":6},{"vertexBId":1,"weight":4},{"vertexBId":2,"weight":2},{"vertexBId":6,"weight":9}]},{"id":4,"name":"E","x":806,"y":654,"edges":[{"vertexBId":1,"weight":9},{"vertexBId":2,"weight":8},{"vertexBId":5,"weight":8},{"vertexBId":6,"weight":7},{"vertexBId":8,"weight":9},{"vertexBId":9,"weight":10},{"vertexBId":13,"weight":4}]},{"id":5,"name":"F","x":768,"y":1005,"edges":[{"vertexBId":0,"weight":9},{"vertexBId":1,"weight":9},{"vertexBId":4,"weight":8},{"vertexBId":9,"weight":18},{"vertexBId":12,"weight":9}]},{"id":6,"name":"G","x":701,"y":118,"edges":[{"vertexBId":2,"weight":9},{"vertexBId":3,"weight":9},{"vertexBId":4,"weight":7},{"vertexBId":7,"weight":4},{"vertexBId":8,"weight":5},{"vertexBId":11,"weight":12}]},{"id":7,"name":"H","x":1148,"y":78,"edges":[{"vertexBId":6,"weight":4},{"vertexBId":8,"weight":1},{"vertexBId":9,"weight":4},{"vertexBId":10,"weight":7}]},{"id":8,"name":"I","x":1239,"y":282,"edges":[{"vertexBId":4,"weight":9},{"vertexBId":6,"weight":5},{"vertexBId":7,"weight":1},{"vertexBId":9,"weight":3}]},{"id":9,"name":"J","x":1550,"y":332,"edges":[{"vertexBId":4,"weight":10},{"vertexBId":5,"weight":18},{"vertexBId":7,"weight":4},{"vertexBId":8,"weight":3},{"vertexBId":10,"weight":12},{"vertexBId":11,"weight":5}]},{"id":10,"name":"K","x":1473,"y":159,"edges":[{"vertexBId":7,"weight":7},{"vertexBId":9,"weight":12}]},{"id":11,"name":"L","x":1416,"y":617,"edges":[{"vertexBId":2,"weight":14},{"vertexBId":6,"weight":12},{"vertexBId":12,"weight":3},{"vertexBId":13,"weight":2},{"vertexBId":9,"weight":5}]},{"id":12,"name":"M","x":1409,"y":838,"edges":[{"vertexBId":5,"weight":9},{"vertexBId":11,"weight":3},{"vertexBId":13,"weight":11}]},{"id":13,"name":"N","x":1102,"y":833,"edges":[{"vertexBId":4,"weight":4},{"vertexBId":11,"weight":2},{"vertexBId":12,"weight":11}]}]';
	importGraph();
}

function importGraph() {
	if (KruskalIsRunning) return;
	if (PrimIsRunning) return;
	const data = inputTextArea.value();
	if (data) {
		const obj = JSON.parse(data);
		graph.clear();
		obj.forEach((vertex) => {
			graph.importVertex(
				new Vertex(vertex.x, vertex.y, diameter, fontSize)
			);
		});
		obj.forEach((vertex) => {
			for (let edge of vertex.edges) {
				graph.connect(
					vertex.id,
					edge.vertexBId,
					edge.weight,
					'blue',
					'white',
					'blue',
					'white',
					'black',
					1
				);
			}
		});
		loop();
	}
	KruskalIsRunning = false;
	currentVertex = null;
}

//Save image với định dạng JSON file
function saveImage() {
	inputTextArea.value(graph.export());
	saveCanvas('MyGraph', 'png');
	console.log('save', inputTextArea.value());
	saveStrings(inputTextArea.value().split('\n'), 'MyGraph.txt');
}

function findSelectVertex() {
	currentVertex = graph.findSelectedVertex();
	loop();
}

function mousePressed() {
	if (KruskalIsRunning) return;
	if (PrimIsRunning) return;
	mouseIsDragged = false;
	findSelectVertex();
}

function mouseClicked() {
	if (KruskalIsRunning) return;
	if (PrimIsRunning) return;

	mouseIsDragged = false;
	findSelectVertex();
	if (currentVertex) {
		if (selectingVertexA) {
			selectedVertexA = currentVertex;
			document.getElementById('buttonSelectVertexA').innerText =
				'Chọn Vertex 1 => ' + selectedVertexA.name;
			document.getElementById('buttonSelectVertexA').style.background =
				'white';
		} else if (selectingVertexB) {
			selectedVertexB = currentVertex;
			document.getElementById('buttonSelectVertexB').innerText =
				'Chọn Vertex 2 => ' + selectedVertexB.name;
			document.getElementById('buttonSelectVertexB').style.background =
				'white';
		} else if (selectingStartVertex) {
			selectedStartVertex = currentVertex;
			PrimIsRunning = true;
			document.getElementById('buttonSelectStartVertex').innerText =
				"Prim's Algorithm: Start Vertex = " + selectedStartVertex.name;
			document.getElementById(
				'buttonSelectStartVertex'
			).style.background = 'yellow';
			PrimMST();
		}
	}
}

function mouseDragged() {
	if (KruskalIsRunning) return;
	if (PrimIsRunning) return;
	mouseIsDragged = true;
	if (currentVertex) {
		currentVertex.x = mouseX;
		currentVertex.y = mouseY;
		loop();
	}
	return false;
}

function mouseReleased() {
	if (KruskalIsRunning) return;
	if (PrimIsRunning) return;
	if (mouseIsDragged && currentVertex) {
		currentVertex.x = mouseX;
		currentVertex.y = mouseY;
		currentVertex = null;
		loop();
	}
	mouseIsDragged = false;
	return false;
}
