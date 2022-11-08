type MDNO = [term: number, bitmap: number][];

function minimize(minterms: number[], n: number) {
	let HM = new Map([[(1 << n) - 1, new Set(minterms)]]);

	let ans: MDNO = [];
	while (HM.size > 0) {
		let temp: typeof HM = new Map();

		for (const [bitmap, terms] of HM) {
			for (const term of terms) {
				let hasNeighbor = false;

				for (let i = 0; i < n; i++) {
					const hasIthVariable = (1 << i) & bitmap;
					const currentHasNeighbor = terms.has((1 << i) ^ term);
					if (!hasIthVariable || !currentHasNeighbor) continue;

					hasNeighbor = true;
					const key = (1 << i) ^ bitmap;

					if (!temp.has(key)) {
						temp.set(key, new Set());
					}

					temp.get(key)?.add(term & ~(1 << i));
				}

				if (!hasNeighbor) {
					ans.push([term, bitmap]);
				}
			}
		}
		HM = temp;
	}

	// remove redundant terms

	return removeRedundant(ans);
}

function removeRedundant(mdno: MDNO) {
	return mdno;
}

function latexFormat(mdno: MDNO, n: number) {
	const disjunctions = [];
	for (const [term, bitmap] of mdno) {
		const conjunctions = [];

		for (let i = n - 1; i >= 0; i--) {
			if (bitmap & (1 << i)) {
				let variable = "{x}";

				if (!(term & (1 << i))) {
					variable = String.raw`\bar{${variable}}`;
				}

				variable += `_{${n - i}}`;
				conjunctions.push(variable);
			}
		}
		disjunctions.push(conjunctions.join(""));
	}

	return String.raw({ raw: disjunctions.join(String.raw`\lor`) });
}

export { minimize, latexFormat };
