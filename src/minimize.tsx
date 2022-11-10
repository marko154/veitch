import { Format } from "./App";

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
  return removeRedundant_sets(ans, minterms);
  // return removeRedundant(ans);
}

function removeRedundant_loops(mdno: MDNO, minterms: number[]) {
  const ans: MDNO = [];

  for (const minterm of minterms) {
    let count = 0;
    let T = [-1, -1] as [number, number];

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
  return removeNontrivialRedundant(ans, otherMinterms, 0);
}

function removeNontrivialRedundant(mdno: MDNO, minterms: number[], i: number) {
  // try removing a term from mdno
  // if it still covers all the minterms call function recursively with the other terms
  // otherwise do nothing
  if (i >= mdno.length || minterms.length === 0) return mdno;

  for (let i = 0; i < mdno.length; i++) {}
	return mdno;
}

function removeRedundant_bitmasks(mdno: MDNO, minterms: number[]) {
  let fullBitmask = 0;
  for (const minterm of minterms) {
    fullBitmask = fullBitmask | (1 << minterm);
  }
	const getMinterms = (bitmask: number) => [] as number[];

  const bitmasks = mdno.map(([term, bitmask]) => {
    let B = 0;
    for (const mint of getMinterms(bitmask)) {
      B |= 1 << mint;
    }
    return B;
  });

  // solve(bitmasks, fullBitmask);

	return mdno;
}



function removeRedundant_sets(mdno: MDNO, minterms: number[]) {
  const terms = mdno.map(
    ([term, bitmask]) =>
      [term, bitmask, new Set()] as [number, number, Set<number>]
  );
  for (const [term, bitmask, coveredMinterms] of terms) {
    for (const minterm of minterms) {
      if ((minterm & bitmask) === term) {
        coveredMinterms.add(minterm);
      }
    }
  }
  const ans = recurse(terms, minterms.length);
  return ans.map(([term, bitmask]) => [term, bitmask]) as MDNO;
}

function recurse(terms: [number, number, Set<number>][], total: number) {
  let ans = terms;
  for (let i = 0; i < terms.length; i++) {
    let union = new Set<number>();
    const nextTerms: typeof terms = [];

    for (let j = 0; j < terms.length; j++) {
      if (j === i) continue;
      const [term, bitmask, coveredMinterms] = terms[j];
      union = new Set([...union, ...coveredMinterms]);
      nextTerms.push([term, bitmask, coveredMinterms]);
    }

    if (union.size === total) {
      const possible = recurse(nextTerms, total);
      if (possible.length < ans.length) {
        ans = possible;
      }
    }
  }
  return ans;
}

function latexFormat(mdno: MDNO, n: number, format: Format) {
  // handle different formats
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
