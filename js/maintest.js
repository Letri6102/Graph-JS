function setup() {
	width = windowWidth - 30;
	height = windowHeight - 30;
	createCanvas(width, height);

    const lineHeight = 30;
	let line = 1;
	buttonAddVertex = createButton('Button');
	buttonAddVertex.position(15, (lineHeight * line++));
	buttonAddVertex.mousePressed(addVertex);
}

console.log(top);