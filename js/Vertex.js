class Vertex {
	static #id = 0;
	static #drawID = true;
	static nextGroupId = 1;

	constructor(x, y, diameter, fontSize) {
		this.id = Vertex.#id++;
		this.name = String.fromCharCode(65 + this.id);
		this.fontSize = fontSize;
		this.x = x;
		this.y = y;
		this.diameter = diameter;
		this.color = 'blue';
		this.background = 'white';

		this.mst = false;
		this.groupId = 0;

		this.edges = [];
	}

	addEdge(vertexB, weight, color, lineWeight) {
		let foundEdge = null;
		for (let edge of this.edges) {
			if (edge.vertexB.id === vertexB.id) {
				foundEdge = edge;
			}
		}
		if (foundEdge) {
			foundEdge.weight = weight;
			foundEdge.color = color;
			foundEdge.lineWeight = lineWeight;
			if (weight <= 0) {
				this.edges = this.edges.filter((edge) => edge.weight > 0);
			}
		} else {
			this.edges.push(new Edge(this, vertexB, weight, color, lineWeight));
		}
	}

	showAdjacency() {
		this.background = 'red';
		this.color = 'white';
		for (let edge of this.edges) {
			edge.vertexB.background = 'blue';
			edge.vertexB.color = 'white';
			edge.color = 'red';
			edge.lineWeight = 5;
			for (let edgeB of edge.vertexB.edges) {
				if (edgeB.vertexB.id === this.id) {
					edgeB.color = 'red';
					edgeB.lineWeight = 5;
				}
			}
		}
	}

	static showHideId() {
		Vertex.#drawID = !Vertex.#drawID;
	}

	static setId(no) {
		Vertex.#id = no;
	}

	reset() {
		this.mst = false;
		this.groupId = 0;
		Vertex.nextGroupId = 1;
		this.background = 'white';
		this.color = 'blue';
		for (let edge of this.edges) {
			edge.color = 'black';
			edge.lineWeight = 1;
		}
	}

	draw() {
		for (let edge of this.edges) {
			if (edge.vertexB.id > this.id) {
				this.drawLine(
					this,
					edge.vertexB,
					edge.color,
					this.directed,
					edge.weight,
					edge.lineWeight
				);
			}
		}
		this.drawVertex();
	}

	export() {
		let edges = [];
		for (let edge of this.edges) {
			edges.push({
				vertexBId: edge.vertexB.id,
				weight: edge.weight,
			});
		}
		let vertex = {
			id: this.id,
			name: this.name,
			x: int(this.x),
			y: int(this.y),
			edges: edges,
		};
		return vertex;
	}

	drawVertex() {
		stroke(this.color);
		strokeWeight(1);
		fill(this.background);
		circle(this.x, this.y, this.diameter);
		fill(this.color);
		strokeWeight(0);
		textSize(this.fontSize);
		const textW = textWidth(this.name);
		text(this.name, this.x - textW / 2, this.y + (textAscent() * 0.8) / 2);

		if (Vertex.#drawID && +this.groupId > 0) {
			fill('magenta');
			stroke('magenta');
			strokeWeight(0.5);
			textSize(int(this.fontSize * 0.3));
			const indexW = textWidth(this.id);
			circle(
				this.x,
				this.y - (textAscent() * 0.8) / 2 - this.diameter * 0.4,
				20
			);
			stroke('white');
			fill('white');
			text(
				this.groupId,
				this.x - indexW / 2,
				this.y - (textAscent() * 0.8) / 2 - this.diameter * 0.36
			);
		}
	}

	drawLine(vertexA, vertexB, edgeColor, directed, weight, lineWeight) {
		stroke(edgeColor);
		strokeWeight(lineWeight);
		const distance = int(dist(vertexA.x, vertexA.y, vertexB.x, vertexB.y));
		if (distance === 0) return;

		const x1 =
			vertexA.x - (diameter / 2 / distance) * (vertexA.x - vertexB.x);
		const y1 =
			vertexA.y - (diameter / 2 / distance) * (vertexA.y - vertexB.y);
		const x2 =
			vertexB.x + (diameter / 2 / distance) * (vertexA.x - vertexB.x);
		const y2 =
			vertexB.y + (diameter / 2 / distance) * (vertexA.y - vertexB.y);
		if (!directed) {
			line(x1, y1, x2, y2);
			if (weight >= 0) {
				push();
				translate((x1 + x2) / 2, (y1 + y2) / 2);
				rotate(atan2(y2 - y1, x2 - x1));
				stroke(edgeColor);
				strokeWeight(0);
				fill(edgeColor);
				textSize(int(fontSize * 0.7));
				text(weight, -(textWidth(weight) * 0.6), -10);
				pop();
			}
			return;
		}
		push();
		translate((x1 + x2) / 2, (y1 + y2) / 2);
		rotate(atan2(y2 - y1, x2 - x1));
		beginShape();
		noFill();
		const d = (0.5 * (distance - diameter)) / 2;
		vertex((-distance + diameter) / 2, 0);
		bezierVertex(
			(-distance + diameter) / 2 + d,
			-d,
			(distance - diameter) / 2 - d,
			-d,
			(distance - diameter) / 2,
			0
		);
		endShape();
		pop();

		if (weight >= 0) {
			push();
			translate((x1 + x2) / 2, (y1 + y2) / 2);
			rotate(atan2(y2 - y1, x2 - x1));
			stroke(edgeColor);
			strokeWeight(0);
			fill(edgeColor);
			textSize(int(fontSize * 0.7));
			text(weight, -(textWidth(weight) * 0.6), -d);
			pop();
		}

		strokeWeight(1);
		stroke(edgeColor);
		fill(edgeColor);
		push();
		translate((x1 + x2) / 2, (y1 + y2) / 2);
		rotate(atan2(y2 - y1, x2 - x1));
		push();
		translate((distance - diameter) / 2, 0);
		rotate(atan2(d, d * 1.4));
		triangle(-20, -5, -20, 5, 0, 0);
		pop();
		pop();
	}
}
