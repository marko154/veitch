import { useState } from "react";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { latexFormat, minimize } from "./minimize";

function App() {
	const [mintermsStr, setMintermsStr] = useState(
		"1, 4, 6, 7, 8, 9, 10, 11, 15"
	);
	const [numberOfVars, setNumberOfVars] = useState("4");
	const [format, setFormat] = useState<"circuit" | "logic">("circuit");

	// do validation of input (n is large enough, minterms are numbers in correct format)
	const minterms = mintermsStr.replaceAll(",", "").split(" ").map(Number);
	const n = parseInt(numberOfVars);
	const mdno = minimize(minterms, n);
	const latex = "$" + String.raw({ raw: latexFormat(mdno, n) }) + " $";
	console.log({ minterms, n, mdno, latex });

	return (
		<div className="mx-20 my-16">
			<h1 className="py-6 text-2xl">PDNO minimizer</h1>

			<div className="flex gap-6">
				<input
					className="rounded-md px-2"
					placeholder="number of variables"
					value={numberOfVars}
					onChange={(e) => setNumberOfVars(e.target.value)}
				/>
				<div className="flex">
					<div>
					</div>
					<input
						className="rounded-md px-2 w-56"
						placeholder="minterms"
						value={mintermsStr}
						onChange={(e) => setMintermsStr(e.target.value)}
					/>
					<div></div>
				</div>
			</div>

			<section className="mt-20">
				<VeitchDiagram numberOfVars={4} />
				<h3>
					<Latex>{latex}</Latex>
				</h3>
			</section>
		</div>
	);
}

function VeitchDiagram({
	numberOfVars = 4,
}: {
	numberOfVars: number;
	// minterms: number[];
}) {
	const grid = Array(numberOfVars).fill(
		Array(numberOfVars).fill(Math.random())
	);
	console.log(grid);
	const numOfRows = 4;
	const numOfCols = 4;

	return (
		<div
			className="grid"
			style={{
				aspectRatio: `${numOfCols}/${numOfRows}`,
				gridTemplateColumns: `repeat(${numOfCols}, 1fr)`,
				gridTemplateRows: `repeat(${numOfRows}, 1fr)`,
			}}
		>
			{grid.map((row) =>
				row.map((value, i) => (
					<div className="border" key={i}>
						{"minterm"}
					</div>
				))
			)}
		</div>
	);
}

function LogicGates() {
	return <div></div>;
}

export default App;
