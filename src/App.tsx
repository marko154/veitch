import { useEffect, useState } from "react";

import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { latexFormat, minimize } from "./minimize";
import cn from "classnames";

const FORMATS = ["circuit", "logic"] as const
export type Format = typeof FORMATS[number];

function getMintermsFromString(mintermsStr: string) {
  return mintermsStr
    .replaceAll(",", " ")
    .split(/\s+/)
    .filter((chunk) => /\d+/.test(chunk))
    .map(Number);
}

function isValidMintermsString(mintermsStr: string) {
  return /^(\s*\d+\s*,?\s*)+$/.test(mintermsStr);
}

function isPositiveInt(str: string) {
  return /\d+/.test(str);
}

function useMinimizer({
  mintermsStr,
  numberOfVars,
  format,
}: {
  mintermsStr: string;
  numberOfVars: string;
  format: Format;
}) {
  const [minterms, setMinterms] = useState([] as number[]);
  const [isMintermStrValid, setIsMintermsStrValid] = useState(false);
  const [n, setN] = useState(1);

  useEffect(() => {
    const isMintermStrValid = isValidMintermsString(mintermsStr);
    setIsMintermsStrValid(isMintermStrValid);

    if (isMintermStrValid) {
      // handle duplicate minterms, larger than or eq 1 << n minterms
      setMinterms(getMintermsFromString(mintermsStr));
    }

    if (isPositiveInt(numberOfVars)) {
      setN(parseInt(numberOfVars));
    }
  }, [mintermsStr]);

  const mdno = minimize(minterms, n); //.sort(([term], [term2]) => term - term2);
  const latex = "$" + String.raw({ raw: latexFormat(mdno, n, format) }) + " $";

  return { minterms, mdno, n, latex, isMintermStrValid };
}

function App() {
  const [mintermsStr, setMintermsStr] = useState(
    "1, 4, 6, 7, 8, 9, 10, 11, 15"
  );
  const [numberOfVars, setNumberOfVars] = useState("4");
  const [format, setFormat] = useState<Format>("circuit");

  const { minterms, n, mdno, latex, isMintermStrValid } = useMinimizer({
    mintermsStr,
    format,
    numberOfVars,
  });
  console.log({ minterms, n, mdno, latex, isMintermStrValid });

  const isNumberOfVarsValid = isPositiveInt(numberOfVars);

  return (
    <div className="mx-20 my-16">
      <h1 className="py-6 text-2xl">PDNO minimizer</h1>

      <div className="flex gap-6">

        <div className="grid gap-1">
          <label className="pl-[3px] text-sm" htmlFor="numOfVars">
            Number of variables
          </label>
          <input
            id="numOfVars"
            className={cn("rounded-md px-2 w-56 border", {
              "border-red-300": !isNumberOfVarsValid,
              "outline-red-300": !isNumberOfVarsValid,
            })}
            placeholder="number of variables"
            value={numberOfVars}
            onChange={(e) => setNumberOfVars(e.target.value)}
          />
        </div>

        <div className="flex">
          <div className="grid">
            <label className="pl-[22px] text-sm" htmlFor="minterms">
              Minterms
            </label>
            <div>
              <Latex>$\lor($</Latex>
              <input
                id="minterms"
                className={cn("rounded-md px-2 w-56 border", {
                  "border-red-300": !isMintermStrValid,
                  "outline-red-300": !isMintermStrValid,
                })}
                placeholder="minterms"
                value={mintermsStr}
                onChange={(e) => setMintermsStr(e.target.value)}
              />
              <Latex>$)$</Latex>
            </div>
          </div>
        </div>

				<div className="grid gap-1">
          <label className="pl-[3px] text-sm" htmlFor="format">
            Format (doesnt work yet)
          </label>
          <select
            id="format"
            className={cn("rounded-md px-2 w-40 border", {
              "border-red-300": !isNumberOfVarsValid,
              "outline-red-300": !isNumberOfVarsValid,
            })}
            placeholder="number of variables"
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
          >
						{FORMATS.map(format => (
							<option value={format}>{format}</option>
						))}
					</select>
        </div>

      </div>
      <section className="mt-10 grid gap-3">
        <h3 className="text-xl">Minimized: </h3>
        <h3 className="pl-4">
          <Latex>{latex}</Latex>
        </h3>
      </section>
      <section className="mt-16">
        <VeitchDiagram numberOfVars={4} />
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
          <div className="border grid place-items-center" key={i}>
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
