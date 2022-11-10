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

function removeRedundant(mdno: MDNO, minterms: number[]) {
	const ans: MDNO = [];

	for (const minterm of minterms) {
		let count = 0;
		let T = [-1, -1];

		for (const M of mdno) {
			const [term, bitmask] = M;
			if ((minterm & bitmask) === term) {
				count++;
				T = M;
			}
		}

		if (count === 1) {
			ans.push(T);
		}
	}

	const rest = [];

	for (const M of mdno) {
		const [term, bitmask] = M;
		let isNeeded = false;
		for (const M2 of ans) {
			if (term === M2[0] && bitmask === M2[1]) {
					isNeeded = true;
			}
		}

		if (!isNeeded) {
			rest.push(M);
		}
	}

	const otherMinterms = [];

	for (const minterm of minterms) {
		let isCovered = false;
		for (const [term, bitmask] of ans) {
			if ((minterm & bitmask) === term) {
				isCovered = true;
				break;
			}
		}
		if (!isCovered) {
			otherMinterms.push(minterm);
		}
	}
	return removeNontrivialRedundant(ans, otherMinterms);
}

function removeNontrivialRedundant(mdno : MDNO, minterms: number[], i: number) {
	// try removing a term from mdno
	// if it still covers all the minterms call function recursively with the other terms
	// otherwise do nothing
	if (i >= mdno.length || minterms.length === 0) return mdno;


	for (let i = 0; i < mdno.length; i++) {

	}

	
}

function mark2(mdno : MDNO, minterms: number[]) {
	let fullBitmask = 0;
	for (const minterm of minterms) {
		fullBitmask = fullBitmask | (1 << minterm);
	}

	const bitmasks = mdno.map(([term, bitmask]) => {
		let B = 0;
		for (const mint of getMinterms()) {
			B |= (1 << mint);
		}
		return B;
	})

	solve(bitmasks, fullBitmask)
}

function solve() {}


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
